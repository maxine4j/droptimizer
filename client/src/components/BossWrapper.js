import React, {Component} from 'react';
import BossHeader from './BossHeader';


class BossWrapper extends Component {
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
        let bossHeaders = [];
        let bossItems = [];
        let counter = 0;
        for(let i = 0; i < this.props.bosses.length; i++){
            let loadingItems = true;
            let bItems = this.props.bosses[i].loot;
            //console.log(bItems);
            let out = []
            for(let j = 0; j < this.props.items.length; j++){
                for(let k = 0; k < bItems.length; k++){
                    if(bItems[k].id === this.props.items[j].id){
                        let result = this.props.items[j];
                        out.push(result);
                    }
                }
            }
            //console.log(out);
            if(out.length > 0){
                bossItems.push(out);
                loadingItems = false;
                counter += out.length;
            }
            bossHeaders.push(<BossHeader loading={loadingItems} boss={this.props.bosses[i]} items={bossItems[i]} players={this.props.players} key={i} />)
        }
        //console.log(bossItems);
        console.log(counter);
        
        return (
            <div className="BossWrapper align-items-center">
                {bossHeaders}
            </div>
        );
        
    }
}

export default BossWrapper;