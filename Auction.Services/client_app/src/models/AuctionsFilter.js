const CATEGORY_PARAM = 'category';
const USER_NAME_PARAM = 'userName';

class AuctionsFilter {
    categories = [];
    userName = null;
    
    constructor(categories, userName) {
        this.categories = categories;
        this.userName = userName;
    }
    
    static fromQueryString(search) {
        const searchParams = new URLSearchParams(search);

        const categories = searchParams.getAll(CATEGORY_PARAM);
        const userName = searchParams.get(USER_NAME_PARAM);

        return new AuctionsFilter(categories, userName || null);
    }
    
    getQueryString(){
        const searchParams = new URLSearchParams();
        
        this.categories.forEach(c => searchParams.append(CATEGORY_PARAM, c));
        
        if (this.userName) {
            searchParams.append(USER_NAME_PARAM, this.userName);
        }
        
        return searchParams.toString();
    }
    
    cloneWithUpdatedCategories(categories){
        return new AuctionsFilter(categories);
    }
}

export default AuctionsFilter;