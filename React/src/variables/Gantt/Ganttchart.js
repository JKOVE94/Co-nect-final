import React, { Component } from 'react';
import Gantt from './components/Gantt';
import Toolbar from './components/Toolbar';
import { gantt } from 'dhtmlx-gantt';

class Ganttchart extends Component {
    state = {
        currentZoom: 'Days',
        messages: [],
    };
    
    addMessage = (message) => {
        const maxLogLength = 5;
        const newMessage = { message };
        const messages = [
            newMessage,
            ...this.state.messages
        ];

        if(messages.length > maxLogLength) {
            messages.length = maxLogLength;
        }
        this.setState({ messages });
    }

    logDataUpdate = (entityType, action, itemData, id) => {
        let text = itemData && itemData.text ? ` (${itemData.text})` : '';
        let message = `${entityType} ${action}: ${id} ${text}`;
        if (entityType === 'link' && action !== 'delete') {
            message += ` ( source: ${itemData.source}, target: ${itemData.target} )`;
        }
        this.addMessage(message);
    }

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
                    duration: task.task_duration,
                    progress: task.task_progress,
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

    componentDidUpdate(prevProps) {
        if (prevProps.taskdatas !== this.props.taskdatas) {
            const ganttData = this.convertToGanttData(this.props.taskdatas);
            gantt.clearAll();
            gantt.parse(ganttData);
        }
    }

    handleTaskUpdate = (id, task) => {
        const updatedTasks = this.props.taskdatas.map(t => t.task_pk_num === id ? task : t);
        this.props.setTaskdatas(updatedTasks);
    }

    handleTaskAdd = (task) => {
        const newTask = {
            task_pk_num: task.id,
            task_title: task.text,
            task_startdate: task.start_date,
            task_duration: task.duration,
            task_progress: task.progress,
            task_fk_task_num: task.parent,
            task_depth: task.parent ? 1 : 0 // Assuming task_depth is 1 if it has a parent
        };
        const newTasks = [...this.props.taskdatas, newTask];
        this.props.setTaskdatas(newTasks);
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
                    style={{ width: '100%', height: '500px' }} // 적절한 스타일 설정
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