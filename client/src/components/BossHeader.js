import React, {Component} from 'react';
import LootList from './LootList';


class BossHeader extends Component {
    constructor(props) {
        super();
        this.state = {
            collapsed: true,
        }
    }

    onHeaderClick = (event) => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        if(this.props.loading === false){

        }
        if(this.state.collapsed === false){
            if(this.props.loading === false){
                return (
                    <div className="BossWrapper align-items-center">
                        <div className="BossHeader unselectable bg-dark rounded d-flex pt-2 px-2 mt-2 mx-2 align-items-center" onClick={this.onHeaderClick}>
                            <img className="BossImage" alt="" src={this.props.boss.image} />
                            <h3 className="BossName text-light align-middle">{this.props.boss.name}</h3>
                        </div>
                        <LootList loot={this.props.items} players={this.props.players}/>
                    </div>
                );
            }
            else{
                return(
                    <div className="BossWrapper align-items-center">
                        <div className="BossHeader unselectable bg-dark rounded d-flex pt-2 px-2 mt-2 mx-2 align-items-center" onClick={this.onHeaderClick}>
                            <img className="BossImage" alt="" src={this.props.boss.image} />
                            <h3 className="BossName text-light align-middle">{this.props.boss.name}</h3>
                        </div>
                        <div className="LootList rounded-bottom m-auto pb-1 pt-1 px-2">
                            <div className="ItemListSpinner pr-auto">
                                <div className="PlayerHeader d-flex justify-content-center align-items-center py-2">
                                <img src="src/spinner.svg" alt="" height="40px" />

                                </div>
                            </div>
                        </div>
                    </div>
                );

            }
        }
        else{
            return(
                <div className="BossWrapper align-items-center">
                    <div className="BossHeader unselectable bg-dark rounded d-flex pt-2 px-2 mt-2 mx-2 align-items-center" onClick={this.onHeaderClick}>
                        <img className="BossImage" alt="" src={this.props.boss.image} />
                        <h3 className="BossName text-light align-middle">{this.props.boss.name}</h3>
                    </div>
                </div>
            );
        }
        
    }
}

export default BossHeader;