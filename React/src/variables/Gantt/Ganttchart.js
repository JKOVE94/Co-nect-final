import React, { Component } from 'react';
import Gantt from './components/Gantt';
import Toolbar from './components/Toolbar';
import { gantt } from 'dhtmlx-gantt';

class Ganttchart extends Component {
    state = {
        currentZoom: 'Days',
        messages: [],
    };
    handleZoomChange = (zoom) => {
        this.setState({
            currentZoom: zoom
        });
    }

    convertToGanttData = (taskdatas) => {
    const tasks = [];
    const taskIds = new Set();
    const taskMap = new Map(); // taskPkNum을 키로 하는 맵 추가

    // 모든 작업을 맵에 저장
    taskdatas.forEach(task => taskMap.set(task.taskPkNum, task));

    const addTasks = (taskList, parentId = null) => { // parentId 기본값을 null로 변경
        if (!Array.isArray(taskList)) return;

        taskList.forEach(task => {
            if (taskIds.has(task.taskPkNum)) {
                console.error(`Cyclic reference detected on task ${task.taskPkNum}`);
                return;
            }
            taskIds.add(task.taskPkNum);

            let actualParentId = parentId; // 실제 부모 ID를 저장할 변수

            if (task.taskDepth > 0) {
                // taskDepth가 0보다 크면 부모 작업 찾기
                const parentTask = Array.from(taskMap.values()).find(t => t.taskPkNum === task.taskGroup);
                if (parentTask) {
                    actualParentId = parentTask.taskPkNum; // 부모 작업의 taskPkNum을 parentId로 설정
                } else {
                    console.error(`Parent task not found for task ${task.taskPkNum}. taskGroup: ${task.taskGroup}`);
                }
            }
            tasks.push({
                id: task.taskPkNum,
                text: task.taskTitle,
                start_date: task.taskStartdate,
                deadline: task.taskDeadline,
                duration: task.taskDuration,
                progress: task.taskProgress / 100,
                member: task.userName,
                color: task.taskTagcol,
                parent: actualParentId // 계산된 actualParentId 사용
            });

            // taskDepth가 0보다 큰 작업이 있다면, 해당 task의 taskPkNum으로 재귀 호출한다.
            if (task.taskDepth > 0) {
              const childTasks = taskdatas.filter(t => t.taskGroup === task.taskPkNum);
              if (childTasks.length > 0) {
                addTasks(childTasks, task.taskPkNum);
              }
            }
        });
    };

    addTasks(taskdatas);
    console.log("Processed tasks:", tasks);
    return { data: tasks, links: [] };
};

    
    componentDidMount() {
        gantt.i18n.setLocale("kr");
        gantt.config.date_format = "%Y-%m-%d %H:%i";
        gantt.plugins({ 
            marker: true 
        });
        gantt.attachEvent("onTaskDblClick", function(id,e){return false;});
        gantt.attachEvent("onBeforeTaskDrag", function(id,e){return false;});

        // 오늘 날짜를 기준으로 마커 추가
        const today = new Date();
        gantt.addMarker({
            start_date: today,
            css: "today",
            text: "Today",
            title: "Today: " + gantt.templates.date_grid(today)
        });

        const ganttData = this.convertToGanttData(this.props.taskdatas);
        gantt.init(this.ganttContainer);
        gantt.parse(ganttData);
    }

     componentDidUpdate(prevProps) {
        if (prevProps.taskdatas !== this.props.taskdatas) {
            const ganttData = this.convertToGanttData(this.props.taskdatas);
            gantt.clearAll();
            gantt.parse(ganttData);
        }
    }

    render() {
        const { currentZoom } = this.state;
        const { taskdatas } = this.props;
        const ganttData = this.convertToGanttData(taskdatas);
        console.log(ganttData);
        return (
            <>
                <Toolbar 
                    zoom={currentZoom}
                    onZoomChange={this.handleZoomChange}
                />
                <div 
                    className="gantt-container" 
                    ref={(input) => { this.ganttContainer = input }} 
                    style={{ width: '100%', height: '500px' }}
                >
                    <Gantt 
                        tasks={ganttData}
                        zoom={this.state.currentZoom}
                        onTaskUpdate={this.handleTaskUpdate}
                        onTaskAdd={this.handleTaskAdd}
                    />
                </div>
                {/* <MessageArea messages={messages} /> */}
            </>
        );
    }
}

export default Ganttchart;