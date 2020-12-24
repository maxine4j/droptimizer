import React, {Component} from 'react';

class PlayerModal extends Component {
    constructor(props) {
        super();
    }

    render() {
        let cls = "class" + this.props.player.class;
        return (
            <div className="PlayerModalWrapper align-items-center">
                <a className="armoryLink" href={"https://worldofwarcraft.com/en-us/character/frostmourne/"+this.props.player.name } rel="noopener noreferrer" target="_blank">
                
                <div className="LootHeader p-1 unselectable bg-dark rounded d-flex align-items-center" onClick={this.onHeaderClick}>
                    <div className="col-3 align-self-center">
                        <div className="row">
                            <div className="row">
                                <div className="col d-flex align-middle align-items-center">
                                    <img className="PlayerModalImage rounded mr-2 align-items-center " alt="" src={"https://render-us.worldofwarcraft.com/character/"+this.props.player.thumbnail}/>
                                    <h5 className={"PlayerName pt-1 " + cls}>{this.props.player.name}</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                </a>

                
            </div>
        );
    }
}

export default PlayerModal;