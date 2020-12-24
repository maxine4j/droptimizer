import React, {Component} from 'react';
import LootHeader from './LootHeader';

class LootList extends Component {
    render() {
        let lootHeaders = [];
        for (var i = 0; i < this.props.loot.length; i++) {
            lootHeaders.push(<LootHeader loot={this.props.loot[i]} players={this.props.players} key={i} />)
        }
        return (
            <div className="LootList rounded-bottom m-auto pb-1 pt-2 px-2">
                {lootHeaders}
            </div>
        );
    }
}

export default LootList;