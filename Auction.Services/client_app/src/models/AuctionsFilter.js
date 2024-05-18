const CATEGORY_PARAM = 'category';

class AuctionsFilter {
    categories = [];

    static fromQueryString(search) {
        const searchParams = new URLSearchParams(search);

        const filter = new AuctionsFilter();
        
        filter.categories = searchParams.getAll(CATEGORY_PARAM);
        
        return filter;
    }
    
    getQueryString(){
        const searchParams = new URLSearchParams();
        
        this.categories.forEach(c => searchParams.append(CATEGORY_PARAM, c));
        
        return searchParams.toString();
    }
    
    cloneWithUpdatedCategories(categories){
        return this.cloneAndReplace('categories', categories);
    }
    
    cloneAndReplace(property, value) {
        const clonedInstance = Object.create(Object.getPrototypeOf(this));
        
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                clonedInstance[key] = this[key];
            }
        }
        
        clonedInstance[property] = value;

        return clonedInstance;
    }

    clone() {
        const clonedInstance = Object.create(Object.getPrototypeOf(this));

        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                clonedInstance[key] = this[key];
            }
        }

        return clonedInstance;
    }
}

export default AuctionsFilter;