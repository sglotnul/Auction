const CATEGORY_PARAM = "category";

class AuctionsFilter {
    categories = [];
    
    constructor(categories) {
        this.categories = categories;
    }
    
    static fromQueryString(search) {
        const searchParams = new URLSearchParams(search);

        const categories = searchParams.getAll(CATEGORY_PARAM);

        return new AuctionsFilter(categories);
    }
    
    getQueryString(){
        const searchParams = new URLSearchParams();
        
        this.categories.forEach(c => searchParams.append(CATEGORY_PARAM, c))
        
        return searchParams.toString();
    }
    
    cloneWithUpdatedCategories(categories){
        return new AuctionsFilter(categories);
    }
}

export default AuctionsFilter;