import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import google.generativeai as genai
from ..core.config import GOOGLE_API_KEY
import os

# Google Gemini 모델 설정
genai.configure(api_key=GOOGLE_API_KEY)
llm_model = genai.GenerativeModel('gemini-1.5-flash')

# SentenceTransformer 모델을 한 번만 생성
EMBEDDING_MODEL_NAME = 'all-mpnet-base-v2'
embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
EMBEDDING_DIR = "app/services/embeddings"

# 임베딩 생성 함수
def create_embeddings(data, text_columns):
    """데이터프레임의 텍스트 컬럼들을 결합하여 임베딩을 생성합니다."""
    texts = []
    for _, row in data.iterrows():
        combined_text = " ".join(str(row[col]) for col in text_columns if pd.notnull(row[col]))
        texts.append(combined_text)
    return embedding_model.encode(texts)


# 임베딩 저장 함수
def save_embeddings(embeddings, filename):
    filepath = os.path.join(EMBEDDING_DIR, filename)
    os.makedirs(EMBEDDING_DIR, exist_ok=True)
    np.save(filepath, embeddings)
    print(f"Embeddings saved to {filepath}")


# 임베딩 로드 함수
def load_embeddings(filename):
    filepath = os.path.join(EMBEDDING_DIR, filename)
    try:
        embeddings = np.load(filepath)
        print(f"Embeddings loaded from {filepath}")
        return embeddings
    except FileNotFoundError:
        print(f"Error: Embeddings file not found at {filepath}")
        return None


# 유사 데이터 검색 함수
def search_similar_data(query_embedding, embeddings, data):
    similarities = cosine_similarity([query_embedding], embeddings)[0]
    sorted_indices = similarities.argsort()[::-1]
    return data.iloc[sorted_indices]  # 모든 유사한 데이터 반환


# 답변 생성 함수 (Gemini API 사용)
def generate_answer_with_gemini(context, question):
    prompt = f"""
    다음 문맥을 참고하여 한국어로 질문에 답해주세요.
    그리고 당신은 업무 어시스턴트를 위한 코넥트입니다. 누군가가 당신에대해서 물어본다면 당신의 이름은 코넥트, 역할은 업무 어시스턴트라고 소개하세요.
    tasks의 "task_fk_proj_num"은 각 작업이 속한 프로젝트의 고유 번호를 나타냅니다.
    projects 테이블의 "proj_pk_num"은 각 프로젝트의 고유 번호이며, tasks 테이블의 "task_fk_proj_num"과 연결됩니다.
    **이번 질문에서는 tasks 테이블의 task_fk_proj_num 값을 프로젝트 번호로 간주하고 답변해주세요.**
    tasks 테이블에서 task_fk_proj_num 컬럼 값이 존재하는 작업들만 사용하여, 각 프로젝트별 작업 수를 계산하고, 작업 수가 가장 많은 프로젝트 번호를 찾아주세요.
    답면 문장의 길이가 100자 이하가 되도록 작성해주세요.
    유저의 정보의 알려줄 때에는 '나는', '내가' 를 사용하지 말고 '사용자님은', '사용자님의' 를 사용해주세요.
    최근에 생성된 업무, 프로젝트를 물어본다면 proj_created, task_created를 사용해서 찾아주고 언제 생성되었는지(proj_created or task_created), 그리고 프로젝트명(proj_title), 업무명(task_title)을 알려줘. 양식은 가장 최근에 생성된 [업무 or 프로젝트]는 [업무 or 프로젝트명]이고, [날짜]에 생성되었습니다. 
    모든 문장에 '안녕하세요. 저는 업무 어시스턴트 코넥트입니다.'를 붙일필요는 없어. 처음 대화한경우에만 붙여줘.
    사용자가 '나' 혹은 '내' 라고 질문하면, 사용자의 정보를 알려줘. 사용자의 정보는 user 테이블에 저장되어있어.
    유저에게 대답할 때에는 user_pk_num대신에 사번, proj_pk_num대신에 프로젝트 번호, task_pk_num대신에 업무번호를 말해줘.
    사용자가 관계에 대해 질문(내가 속한 프로젝트, 내가 속한 업무, 프로젝트가 포함하고 있는 업무, 업무가 포함된 프로젝트) 를 말하면 번호가 아닌 이름으로 알려줘.
    프로젝트 생성일은 porj_created 컬럼에 저장되어있어. 업무 생성일은 task_created 컬럼에 저장되어있어.
    그리고 컬럼과 관련된 정보를 알려줄때는 컬럼명을 노출하지 않도록 주의해줘.
    데이터가 없는 경우에는 '저는 이제 막 태어난 AI어시스턴트 코넥트입니다. 질문해주신 내용은 아직 잘 모르겠어요' 이라고 답해줘.
    사용자가 간단한 질문을 한다면 간단한 대답으로 답해줘. 예를 들어 '안녕하세요' 라고 인사를 하면 '안녕하세요. 무엇을 도와드릴까요?' 라고 대답해줘.
    
    문맥:
    {context}

    질문:
    {question}

    답변:
    """
    response = llm_model.generate_content(prompt)
    return response.text


# 사용자 질문 처리 및 답변 생성 함수
def get_answer(user_question, db_data):
    # 프로젝트 데이터 가져오기
    project_member_user_df = db_data['projects']

    # 임베딩 데이터 가져오기
    user_embeddings = load_embeddings("user_embeddings.npy")
    project_embeddings = load_embeddings("project_embeddings.npy")
    task_embeddings = load_embeddings("task_embeddings.npy")

    # 임베딩 파일이 없으면 생성
    if user_embeddings is None:
        user_embeddings = create_embeddings(db_data["users"], ["user_name", "user_mail", "user_lastlogin"])
        save_embeddings(user_embeddings, "user_embeddings.npy")
    if project_embeddings is None:
        project_embeddings = create_embeddings(project_member_user_df,
                                               ["proj_pk_num", "proj_title", "proj_content", "proj_startdate",
                                                "proj_enddate", "proj_status", "proj_updated", "projmem_fk_proj_num",
                                                "projmem_fk_user_num"])
        save_embeddings(project_embeddings, "project_embeddings.npy")
    if task_embeddings is None:
        task_embeddings = create_embeddings(db_data["tasks"],
                                            ["task_pk_num", "task_title", "task_content", "task_startdate",
                                             "task_deadline", "task_duration", "task_progress", "task_status",
                                             "task_created", "task_group", "task_fk_proj_num", "task_fk_user_num"])
        save_embeddings(task_embeddings, "task_embeddings.npy")

    question_embedding = embedding_model.encode([user_question])[0]

    context_template = """
    **나, 나자신, 내가**
    {myself}
    
    **사원, 직원:**
    {users}

    **프로젝트:**
    {projects}

    **업무:**
    {tasks}
    
    **업무기록, 업무변화, 업무수정:**
    {taskchanges}
    """

    # 사용자 정보 (유사한 사용자 상위 2명)
    # 2명의 데이터만 사용하기 때문에 굳이 유사도를 찾을 필요 없이 모든 사용자를 보여주도록 했습니다.
    users_info = db_data["users"].to_markdown()

    # 모든 프로젝트 정보 및 관련 사용자 정보 포함
    projects_info = ""
    for _, project_row in db_data["projects"].iterrows():  # 모든 프로젝트 순회
        project_info = f"- 프로젝트 {project_row['proj_pk_num']}: {project_row['proj_title']}\n"
        members_info = ""
        for _, member_row in db_data["projects"].iterrows():  # 조인된 데이터를 사용
            if pd.notna(member_row['user_name']):
                members_info += f"  * 사용자: {member_row['user_name']} (user_pk_num: {member_row['user_pk_num']})\n"
        if members_info == "":
            members_info = "  * 참여 사용자 정보 없음\n"
        projects_info += project_info + members_info

        # task_fk_proj_num 과 proj_pk_num 연결 정보 추가
        matching_tasks = db_data["tasks"][db_data["tasks"]["task_fk_proj_num"] == project_row["proj_pk_num"]]
        if not matching_tasks.empty:
            project_info += f"  * 관련 업무 (task_fk_proj_num): {', '.join(matching_tasks['task_fk_proj_num'].astype(str).unique())}\n"



    # 업무 정보 (모든 업무)
    tasks_info = db_data["tasks"].to_markdown()
    myself_info = db_data["myself"].to_markdown()
    taskhistories_info = db_data["taskchanges"].to_markdown()
    context = context_template.format(
        users=users_info,
        projects=projects_info,
        tasks=tasks_info,
        myself=myself_info,
        taskchanges=taskhistories_info
    )

    print("생성된 context:\n", context)  # context 내용 확인 (디버깅용)

    answer = generate_answer_with_gemini(context, user_question)
    return answer;