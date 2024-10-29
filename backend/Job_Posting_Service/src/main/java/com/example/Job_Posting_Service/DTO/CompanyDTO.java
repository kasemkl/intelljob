package com.example.Job_Posting_Service.DTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyDTO {

    private Long companyId;
    private String name;
    private String address;
    private String email;
    private String phone;

}
