import React, {PropTypes, Component} from 'react';

export default class Stock extends Component {
    render() {
        const {stock, bindings} = this.props;
        return (
            <div key={stock.code} className="search-result">
                <div className="details">
                    <div className="name">{stock.name}</div>
                    <div className="code">{stock.code}</div>
                </div>
                <div className={'icon star' + (stock.favourite ? ' active' : '')} onClick={() => {
                    bindings.onIconClick(stock);
                }}>&nbsp;</div>
            </div>
        );
    }
}

Stock.propTypes = {
    stock: PropTypes.object.isRequired
};
