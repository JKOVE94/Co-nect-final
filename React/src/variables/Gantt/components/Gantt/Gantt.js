import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import './Gantt.css';
 
export default class Gantt extends Component {

    constructor(props) {
        super(props);
        this.initZoom();
    }

    dataProcessor = null;

    initZoom() {
        gantt.ext.zoom.init({
            levels: [
                {
                    name: "Days",
                    scale_height: 60,
                    min_column_width: 70,
                    scales: [
                        { unit: "week", step: 1, format: "%W번째 주" },
                        { unit: "day", step: 1, format: (date) => (date.getMonth() + 1) + "월 " + date.getDate() + "일" }
                    ]
                },
                {
                    name: "Months",
                    scale_height: 60,
                    min_column_width: 70,
                    scales: [
                        { unit: "month", step: 1, format: "%F" },
                        { unit: "week", step: 1, format: "%W번째 주" }
                    ]
                },
                {
                    name: "Years",
                    scale_height: 60,
                    min_column_width: 70,
                    scales: [
                        { unit: "year", step: 1, format: "%Y" },
                        { unit: "month", step: 1, format: "%F" }
                    ]
                }
            ]
        })
    }

    setZoom(value) {
        gantt.ext.zoom.setLevel(value);
    }

    initGanttDataProcessor() {
        /**
         * type : "task"|"link"
         * action : "create"|"update"|"delete"
         * item : data object object
         */
        
        const onDataUpdated = this.props.onDataUpdated;
        this.dataProcessor = gantt.createDataProcessor((type, action, item, id) => {
            return new Promise((resolve, reject) => {
                if(onDataUpdated) {
                    onDataUpdated({ type, action, item, id });
                }

                //if onDataUpdataed changes returns a permanent id of the created item, you can return it from here so dhtmlxGantt could apply it
                //resolve({id: databaseId});
                return resolve();
            });
        });
    }

    componentWillUnmount(){
        if(this.dataProcessor) {
            this.dataProcessor.destructor();
            this.dataProcessor = null;
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.zoom !== nextProps.zoom;
        
    }

    componentDidUpdate() {
        
        gantt.render();
    }

componentDidMount() {
    gantt.config.columns = [
        { name: "text", label: "업무명", width: "*", tree: true },
        { name: "start_date", label: "시작일", align: "center" },
        { name: "duration", label: "기한 (일)", align: "center" },
        { name: "member", label: "담당자", align: "center" },
    ];
    gantt.config.date_format = "%Y-%m-%d %H:%i";
    const { tasks } = this.props;
    gantt.init(this.ganttContainer);
    this.initGanttDataProcessor();
    gantt.parse(tasks);
    gantt.templates.task_text = (start, end, task) => {
        const member = task.member || "Unknown"; // task 객체에 member 속성이 있는지 확인
        const progress = task.progress || 0; // task 객체에 progress 속성이 있는지 확인
        return `${task.text} - ${member} (${progress * 100}%)`;
    };
    gantt.plugins({
        tooltip: true
    });

    gantt.config.drag_links = false;
    gantt.config.drag_mode = false;
    gantt.config.show_progress = true;
    gantt.templates.tooltip_text = function (start, end, task) {
        return "<b>업무명:</b> " + task.text + "<br/><b>시작일:</b> " +
            gantt.templates.tooltip_date_format(start) +
            "<br/><b>마감일:</b> " + gantt.templates.tooltip_date_format(end);
    };



}

   render() {
    const {zoom} = this.props;
    this.setZoom(zoom);
    return (
        <div
            ref={ (input) => { this.ganttContainer = input } }
            style={ { width: '100%', height: '100%' } }
        ></div>
    );
}
}