import React, {Component} from "react";

export default class Toolbar extends Component {
    handleZoomChange = (e) => {
        if(this.props.onZoomChange) {
            this.props.onZoomChange(e.target.value);
        }
    }

    render(){
        const names = {
            'Hours': "시간",
            'Days': "일",
            'Months': "월",
            'Years': "년"
        };

        return (
            <div className="tool-bar" style={{display:"flex", justifyContent:"flex-end", marginBottom:"1em", marginRight:"1.8em"}}>
                <b>시간 범위 선택:&nbsp; </b>
                <select value={this.props.zoom} onChange={this.handleZoomChange}>
                    {Object.keys(names).map((key) => (
                        <option key={key} value={key}>
                            {names[key]}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}