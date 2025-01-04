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
    const taskMap = new Map(taskdatas.map(task => [Number(task.taskPkNum), task]));

    for (const task of taskdatas) {
        let parentId = null;
        let current = task;
        const visited = new Set();

        while (current && current.taskGroup) {
            const currentTaskGroup = Number(current.taskGroup);
            if (visited.has(currentTaskGroup)) {
                console.error(`Cyclic reference detected for task ${task.taskPkNum}. Path:`, Array.from(visited).join(" -> ") + " -> " + currentTaskGroup);
                parentId = null;
                break;
            }
            visited.add(currentTaskGroup);
            current = taskMap.get(currentTaskGroup);
            if (!current && task.taskGroup) {
                console.warn(`Parent task ${task.taskGroup} not found for task ${task.taskPkNum}`);
                break;
            }
        }

        if (!parentId && task.taskGroup) {
            parentId = Number(task.taskGroup);
        } else if (!task.taskGroup) {
            parentId = 0;
        }

        tasks.push({
            id: Number(task.taskPkNum),
            text: task.taskTitle,
            start_date: task.taskStartdate,
            deadline: task.taskDeadline,
            duration: task.taskDuration,
            progress: task.taskProgress / 100,
            member: task.userName,
            color: task.taskTagcol,
            parent: parentId // 최종 parentId 설정 (null 또는 유효한 taskGroup 값)
        });
    };

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
        // console.log(ganttData);
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