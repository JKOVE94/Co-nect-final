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

        const addTasks = (taskList, parentId = 0) => {
            taskList.forEach(task => {
                tasks.push({
                    id: task.task_pk_num,
                    text: task.task_title,
                    start_date: task.task_startdate,
                    deadline : task.task_deadline,
                    duration: task.task_duration,
                    progress: task.task_progress/100,
                    member: task.task_user_name,
                    color: task.task_tagcol,
                    parent: task.task_fk_task_num || parentId
                });
                
                if (task.children && task.children.length > 0) {
                    addTasks(task.children, task.task_pk_num);
                }
            });
        };

        addTasks(taskdatas);

        return { data: tasks, links: [] };
    }


    componentDidMount() {
        gantt.i18n.setLocale("kr");
        gantt.config.date_format = "%Y-%m-%d %H:%i";
        gantt.config.lightbox.sections = [
            {name:"description", height:38, map_to:"text", type:"textarea", focus:true},
            {name:"time",type:"time", map_to:"auto", time_format:["%Y","%m","%d","%H:%i"]}
        ]
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
        const { currentZoom, messages } = this.state;
        const { taskdatas } = this.props;
        const ganttData = this.convertToGanttData(taskdatas);
        
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
                        setDeleteTarget={this.props.setDeleteTarget}
                        setUpdatedData={this.props.setUpdatedData}
                    />
                </div>
                {/* <MessageArea messages={messages} /> */}
            </>
        );
    }
}

export default Ganttchart;