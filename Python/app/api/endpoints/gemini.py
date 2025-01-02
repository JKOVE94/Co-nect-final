from fastapi import APIRouter, Depends, HTTPException
from app.services.gemini_service import get_answer
from app.core.database import connect_to_db
import pandas as pd

router = APIRouter()

# 의존성 주입용 함수
def get_db_connection():
    db_connection = connect_to_db()
    if db_connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        yield db_connection
    finally:
        db_connection.close()


@router.get("/ask")
async def ask_gemini(userPkNum: str, question: str, db_connection=Depends(get_db_connection)):
    # 데이터베이스에서 데이터 가져오기
    myself_df = pd.read_sql_query(("SELECT user_pk_num, user_name, user_mail, user_lastlogin, user_fk_comp_num FROM user u WHERE user_pk_num = %s"), db_connection, params=(userPkNum,))
    users_df = pd.read_sql_query("SELECT user_pk_num, user_name, user_mail, user_lastlogin, user_fk_comp_num FROM user", db_connection)
    projects_df = pd.read_sql_query("SELECT * FROM project", db_connection)
    projectmembers_df = pd.read_sql_query("SELECT * FROM projectmember", db_connection)
    tasks_df = pd.read_sql_query("""
        SELECT
            t.*,
            th.taskhis_fk_task_num,
            th.taskhis_beforevalue,
            th.taskhis_aftervalue,
            th.taskhis_type,
            th.taskhis_fk_user_num,
            th.taskhis_updated
        FROM task AS t
        LEFT JOIN taskhistory th ON t.task_pk_num = th.taskhis_fk_task_num
    """, db_connection)
    taskchanges_df = pd.read_sql_query("SELECT * FROM taskhistory", db_connection)

    # 1. project와 projectmember 조인
    project_member_df = pd.merge(
        projects_df, projectmembers_df,
        left_on="proj_pk_num", right_on="projmem_fk_proj_num",
        how="left",  # LEFT JOIN
        suffixes=('_project', '_member')  # 중복 컬럼 이름 구분
    )

    # 2. project_member_df와 user 조인
    project_member_user_df = pd.merge(
        project_member_df, users_df,
        left_on="projmem_fk_user_num", right_on="user_pk_num",
        how="left",  # LEFT JOIN
        suffixes=('_project_member', '_user')  # 중복 컬럼 이름 구분
    )
    tasks_project_df = pd.merge(
        tasks_df, projects_df,
        left_on="task_fk_proj_num", right_on="proj_pk_num",
        how="left",  # LEFT JOIN
        suffixes=('_task', '_proj')  # 중복 컬럼 이름 구분
    )

    db_data = {
        "myself": myself_df,
        "users": users_df,
        "projects": project_member_user_df,  # 조인된 데이터프레임 전달
        "tasks": tasks_project_df,  # 조인된 데이터프레임 전달
        "taskchanges": taskchanges_df
    }

    answer = get_answer(question, db_data)
    return {"answer": answer}