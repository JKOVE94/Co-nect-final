import React, { Component } from 'react';
import Gantt from './components/Gantt';
import Toolbar from './components/Toolbar';

import { gantt } from 'dhtmlx-gantt';
import { task } from 'gulp';


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
                parent: parentId
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
            this.props.setTaskdatas(ganttData.data);
        }
        
    }

    render() {
        gantt.i18n.setLocale("kr");
        gantt.config.date_format = "%Y-%m-%d %H:%i";
        gantt.config.lightbox.sections = [
            {name:"description", height:38, map_to:"text", type:"textarea", focus:true},
            {name:"time",type:"time", map_to:"auto", time_format:["%Y","%m","%d","%H:%i"]}
        ]
        gantt.plugins({ 
            marker: true 
        }); 
        
        const { currentZoom, messages } = this.state;
        const { taskdatas } = this.props;
        const ganttData = this.convertToGanttData(taskdatas);
        
       
        return (
            <>
                <Toolbar 
                    zoom={currentZoom}
                    onZoomChange={this.handleZoomChange}
                />
                <div className="gantt-container">
                    <Gantt 
                        tasks={ganttData}
                        zoom={this.state.currentZoom}
                    />
                </div>
                {/* <MessageArea messages={messages} /> */}
            </>
        );
    }
}

export default Ganttchart;