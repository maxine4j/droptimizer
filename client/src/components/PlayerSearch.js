import React, {Component} from 'react';
import RaidbotsTooltip from './RaidbotsTooltip';

class PlayerSearch extends Component {
    constructor(props) {
        super();
        this.state = {
            collapsed: true,
            hideTooltip : true,

        }
    }

    raidbotsEnter = () =>{
        this.setState({hideTooltip : false});
    }
    raidbotsLeave = () =>{
        this.setState({hideTooltip : true});
    }

    render() {
        let cls = "class" + this.props.player.class;
        return (
            <div className="psWrapper px-5 mx-3 align-items-center">
                <div className="psHeader unselectable bg-dark rounded d-flex pt-2 px-2 mt-2 mx-2 align-items-center" onClick={this.onHeaderClick}>
                    <div className="col p-0">
                        <a className="armoryLink d-flex align-items-center" href={"https://worldofwarcraft.com/en-us/character/"+this.props.player.realm+"/"+this.props.player.name } rel="noopener noreferrer" target="_blank">
                            <img className="psImage rounded mr-2 mb-2" alt="" src={"https://render-"+this.props.player.region+".worldofwarcraft.com/character/"+this.props.player.thumbnail} />
                            <h4 className={"psName text-light align-middle pr-2 pl-2 mb-2 pb-1 "+cls}>{this.props.player.name}</h4>
                            <p className={"psGuild text-light align-bottom pr-3 mt-2 "}>{" - "+this.props.player.guild + ' ('+this.props.player.realm+' '+(this.props.player.region).toUpperCase()+')'}</p>
                        </a>
                    </div>
                    <div className="col-auto"></div>
                    <div className="col">
                        <div className="row">
                            <div className="col d-flex p-0 align-self-center justify-content-end">
                                <a className="d-flex align-items-center px-2 mb-1" rel="noopener noreferrer" href={"https://www.wowprogress.com/character/"+this.props.player.region+"/"+this.props.player.realm+"/"+this.props.player.name} target="_blank">
                                    <img className="wowprog rounded" src={'src/wowprog.png'} alt="" title="WoW Progress" height="30px" />
                                </a>
                                <a className="d-flex align-items-center px-2 mb-1" rel="noopener noreferrer" href={"https://www.warcraftlogs.com/character/"+this.props.player.region+"/"+this.props.player.realm+"/"+this.props.player.name} target="_blank">
                                    <img className="wclogs rounded" src={'src/wclogs.png'} alt="" title="Warcraft Logs" height="30px" />
                                </a>
                                <a className="d-flex align-items-center px-2 mb-1" rel="noopener noreferrer" href={"https://raider.io/characters/"+this.props.player.region+"/"+this.props.player.realm+"/"+this.props.player.name} target="_blank">
                                    <img className="raiderio rounded" src={'src/raiderio.png'} alt="" title="Raider.io" height="30px" />
                                </a>
                                <a className="d-flex align-items-center px-2 mb-1" rel="noopener noreferrer" href={"https://worldofwarcraft.com/en-us/character/"+this.props.player.realm+"/"+this.props.player.name} target="_blank">
                                    <img className="armory rounded" src={'src/wowico.png'} alt="" title="Armory" height="30px" />
                                </a>
                                { this.state.hideTooltip ? null : <RaidbotsTooltip player={this.props.player} key={1}/> } 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PlayerSearch;