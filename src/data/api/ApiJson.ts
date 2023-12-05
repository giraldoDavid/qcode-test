
export class ApiJson {
    
    private readonly url: string;

    constructor( url: string ){
        this.url = url;
    }

    async getJson (){
        const response = await fetch(this.url);
        const data = await response.json();

        return data
    }

}


