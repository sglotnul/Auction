import AuctionsFilter from "../models/AuctionsFilter";
import {Link} from "react-router-dom";

const CategoriesView = ({categories}) => {
    return (
        <div className="categories-view">
            {categories.map(c => (
                <Link key={c.id} to={`/auctions?${getQueryString(c.id)}`}>
                    <div className="category-view">{c.name}</div>
                </Link>
            ))}
        </div>
    );
}

function getQueryString(categoryId) {
    return new AuctionsFilter().cloneWithUpdatedCategories([categoryId]).getQueryString();
}

export default CategoriesView;