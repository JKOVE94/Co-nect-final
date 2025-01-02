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

<<<<<<< Updated upstream
    handleTaskUpdate = (id, task) => {
        const updatedTasks = this.props.taskdatas.map(t => 
        t.task_pk_num === id ? {
            ...t,
            task_title: task.text,
            task_startdate: task.start_date,
            task_duration: task.duration,
            task_progress: task.progress,
            task_fk_task_num: task.parent,
            task_updated: new Date().toISOString().split('T')[0] // Assuming task_updated is the current date
        } : t
    );
    // console.log(updatedTasks);
    this.props.setTaskdatas(updatedTasks);
    }

=======
>>>>>>> Stashed changes
    handleTaskAdd = (task) => {
    const newTask = {
        task_pk_num: task.id,
        task_title: task.text,
        task_startdate: task.start_date,
        task_deadline : task.end_date,
        task_duration: task.duration,
        task_progress: task.progress,
        task_fk_task_num: task.parent,
        task_depth: task.parent ? 1 : 0, // Assuming task_depth is 1 if it has a parent
        task_created: new Date().toISOString().split('T')[0], // Assuming task_created is the current date
        task_desc: "",

        task_fk_proj_num: 1, // Assuming a default project number
        task_fk_user_num: null, // Assuming no user is assigned initially
        task_priority: 0, // Assuming default priority
        task_status: "미시작", // Assuming default status
        task_tag: "0", // Assuming default tag
        task_tagcol: "red", // Assuming default tag color
        task_updated: new Date().toISOString().split('T')[0], // Assuming task_updated is the current date
        task_user_name: "", // Assuming no user name initially
        task_version: 1 // Assuming default version
    };
    const newTasks = [...this.props.taskdatas, newTask];
    this.props.setTaskdatas(newTasks);
}

    componentDidMount() {
        gantt.i18n.setLocale("kr");
        gantt.config.date_format = "%Y-%m-%d %H:%i";
<<<<<<< Updated upstream
        gantt.config.lightbox.sections = [
            {name:"description", height:38, map_to:"text", type:"textarea", focus:true},
            {name:"time",type:"time", map_to:"auto", time_format:["%Y","%m","%d","%H:%i"]}
        ]
=======
>>>>>>> Stashed changes
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