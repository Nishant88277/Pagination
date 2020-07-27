import React, {Component} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import sortImg from '../img/sort.png';

let limit = 5, sel = "desc", click;

class Pagination extends Component {
    state = { pagination: [], totalCount: '', cPage: '', search: '', selectValue: 'select', showLoader: true,
                       header: ["Name", "Mobile", "Referred_Count", "Trips"] , Option: [5, 10, 15] };

    componentDidMount() {
        this.loadDoc();
    }

    loadDoc(i=1) {
        if (this._isMounted)
            this.setState({ pagination: [], showLoader: true });
        const headers = {
            'Token': "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDQ2NDIyODQsImlkIjoiNWQyODBkMzIwNWY5NGI3ZTE2YTc4MzM0IiwiaWF0IjoxNTczMTA2Mjg0fQ.p6RFBu6rpio6oDoxR2Hyl1d8n3L9l7QbqPdIEnexZSVsuYEPDgbgWKxfeYCayOYa4cZAr6BXNUXGENewrJsQ6A",
        };
        axios.get(`http://192.168.1.70:3000/admin-api/riders-list?per_page=${limit}&page_no=${i}&search=${this.state.search}&sort=${click}&sort_by=${sel}`, {headers})
        .then(res => {
            if(res.data.data.length > 0){
                let cPage = i;
                const pagination = [...res.data.data];
                let totalCount = Math.ceil(res.data.meta.total / limit);
                this.setState({
                    pagination, totalCount, cPage, showErr: false, showLoader: false
                });
            }
            else {
                this.setState({
                    pagination:[], totalCount:'', showErr: true, showLoader: false
                });
            }
        });
    };

    createElements = () => {
        this._isMounted = true;
        let elements = [], totalCount = this.state.totalCount, cPage = this.state.cPage;
        if (totalCount > 1)
            elements.push(<li className="page-item" key={1} onClick={() => this.loadDoc(1)}>{1}</li>);
        if (cPage > 3 && totalCount > 4)
            elements.push(<li className="page-item" key="..">...</li> );
        cPage = (cPage === 1) ? cPage + 1 : ((cPage === totalCount) ? (totalCount - 1) : cPage);
        for (let i = Math.max(2, cPage - 1); i <= Math.min(totalCount - 1, cPage + 1); i++)
            elements.push( <li className="page-item" key={i} onClick={() => this.loadDoc(i)}>{i}</li> );
        if (cPage < totalCount - 2)
            elements.push(<li className="page-item" key="...">...</li> );
        if (totalCount > 2)
            elements.push( <li className="page-item" key={totalCount} onClick={() => this.loadDoc(totalCount)}>{totalCount}</li> );
        return elements;
    };

    handleChange = (search) => {
        this.setState({ search: search.target.value }, () => this.loadDoc());
    };

    handleSelect = (select) => {
        limit = select.target.value;
        this.loadDoc(1, limit);
    };

    sort = (event) => {
        click = event.target.value;
        (sel === "desc") ? sel = "asc" : sel = "desc";
        this.loadDoc()
    };

    render() {
        return (
            <div className="container">
                <input className="input" type="text" placeholder="search here" onChange={this.handleChange}/>
                <table className='text-center table table-bordered table-hover'>
                    <thead>
                    <tr>
                        {this.state.header.map((tag, index) => <th key={index}><button onClick={this.sort} value={tag.toLowerCase()}>{tag} <img alt="sort" src={sortImg} /></button></th>)}
                    </tr>
                    </thead>
                    {this.state.pagination.map(paginate =>
                        <tbody key={paginate.id}>
                        <tr>
                            <td>{paginate.name}</td>
                            <td>{paginate.mobile}</td>
                            <td>{paginate.referred_count}</td>
                            <td>{paginate.trips}</td>
                        </tr>
                        </tbody>
                    )}
                </table>
                { this.state.showErr && <div className='err1'>Nothing matched your search input!!</div> }
                { this.state.showLoader && <div className='err'>Loading...</div> }
                <select onChange={this.handleSelect}>
                    {this.state.Option.map((Opt, index) => <option key={index} value={Opt}>{Opt}</option>)}
                </select>
                <ul className="pagination">
                    {this.createElements()}
                </ul>
            </div>
        );
    }
}

export default Pagination
