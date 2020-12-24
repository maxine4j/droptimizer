import React, {Component} from 'react';
import Moment from 'react-moment';

class RaidbotsTooltip extends Component {
    constructor(props) {
        super();
    }

    render() {
        if (this.props.rbots === false){
            return (
            <div className="rbTooltip2 rounded bg-dark">
                <div className="d-flex col-auto m-1  justify-self-center ">
                    <div className="mx-auto text-justify-center">
                        <div className="row justify-content-center text-light rbttText2">Last Logout</div>
                        <div className="row justify-content-center text-light rbttText"><Moment className="text-justify-center" fromNow>{this.props.player.lastModified}</Moment></div>
                    </div>
                </div>
            </div>
            );
        }
        else{
            return(
                <div className="rbTooltip rounded bg-dark">
                    <div className="d-flex col-auto m-1  justify-self-center ">
                        <div className="mx-auto text-justify-center">
                            <div className="row justify-content-center text-light rbttText2">Last Updated</div>
                            <div className="row justify-content-center text-light rbttText"><Moment className="text-justify-center" fromNow>{this.props.player.timeStamp}</Moment></div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default RaidbotsTooltip;