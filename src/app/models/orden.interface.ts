export class Orden {
    id:     string;
    name:   string;
    
    provider:
        {
            id: string;
            name: string;
        }
    purchases: 
    {
        items: {
            id:         number;
            reference:  string;
            name:       string;
            price:      number;
            quantity:   string;
            total:      number;
            status:     boolean;
            length;
            splice;
            push;
        }
    }
}