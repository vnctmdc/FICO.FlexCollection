import Employee from "../Entities/Employee";


export class ProfileDto {

    public EmployeeID?: number;

    public Employee?: Employee;

    public IsCheckFinger?: boolean;
    public ActionCode? :string;
    public OtpCode? :string;
    public DeviceName? :string;
}