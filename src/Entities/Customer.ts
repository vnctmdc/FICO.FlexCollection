import CustomerExtPhone from "./CustomerExtPhone";
import CustomerAddress from "./CustomerAddress";

export default class Customer {
    public CustomerID?: number;
    public CustomerCode?: string;
    public CustomerName?: string;
    public IDCard?: string;
    public Job?: string;
    public DOB?: Date;
    public Gender?: string;

    public LstPhone: CustomerExtPhone[] = [];
    public LstCustomerAddress: CustomerAddress[] = [];
}
