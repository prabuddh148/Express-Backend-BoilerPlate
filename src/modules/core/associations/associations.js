// // Associations

// import AddressType from "../../addressType/addressTypeModel.js";
// import Company from "../../company/companyModel.js";
// import CompanyAddress from "../../companyAddress/companyAddressModel.js";
// import CompanyAuthSignatory from "../../companyAuthSignatory/companyAuthSignatoryModel.js";
// import CompanyAuthSignatoryDocument from "../../companyAuthSignatoryDocument/companyAuthSignatoryDocumentModel.js";
// import CompanyBankAccount from "../../companyBankAccount/companyBankAccountModel.js";
// import CompanyDocument from "../../companyDocument/companyDocumentModel.js";
// import CompanyITRReturn from "../../companyITRReturns/companyITRReturnModel.js";
// import CompanyPartner from "../../companyPartner/companyPartnerModel.js";
// import CompanyPartnerDocument from "../../companyPartnerDocument/companyPartnerDocumentModel.js";
// import DocumentRequirement from "../../settings/documentRequirements/documentRequirementsModel.js";
// import CompanyType from "../../companyType/companyTypeModel.js";
// import DocumentType from "../../documentType/documentTypeModel.js";
// import ItrType from "../../itrType/itrTypeModel.js";
// import MsmeType from "../../msmeType/msmeTypeModel.js";
// import Role from "../../roles/roleModel.js";
// import AppliesToType from "../appliesToTypeModel.js";
import User from "../../users/userModel.js";
import UserLoginDetail from "../userLoginDetail.js";

// ////Applies To Type  ↔  Document Requirements
// AppliesToType.hasMany(DocumentRequirement, { foreignKey: "applies_to_type_id", as: "appliesToDocumentRequirements" });
// DocumentRequirement.belongsTo(AppliesToType, { foreignKey: "applies_to_type_id", as: "appliesToType" });
////Role ↔ User
User.hasOne(UserLoginDetail, { foreignKey: "user_id", as: "userLoginDetails" });
UserLoginDetail.belongsTo(User, { foreignKey: "user_id", as: "user" });


////Role ↔ User
// Role.hasMany(User, { foreignKey: "role_id", as: "users" });
// User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

// //// Company ↔ Company Type
// CompanyType.hasMany(Company, { foreignKey: "company_type_id", as: "companiesByType" });
// Company.belongsTo(CompanyType, { foreignKey: "company_type_id", as: "companyType" });

// ////Company Type  ↔  DocumentRequirement
// CompanyType.hasMany(DocumentRequirement, { foreignKey: "company_type_id", as: "companyDocumentRequirements" });
// DocumentRequirement.belongsTo(CompanyType, { foreignKey: "company_type_id", as: "companyType" });


// //// Company ↔ MSME Type
// MsmeType.hasMany(Company, { foreignKey: "msme_type_id", as: "companiesByMsmeType" });
// Company.belongsTo(MsmeType, { foreignKey: "msme_type_id", as: "msmeType" });


// // AddressType ↔ CompanyAddress
// AddressType.hasMany(CompanyAddress, { foreignKey: "address_type_id", as: "companyAddressesByType" });
// CompanyAddress.belongsTo(AddressType, { foreignKey: "address_type_id", as: "addressType" });


// // DocumentType ↔ CompanyDocument
// DocumentType.hasMany(CompanyDocument, { foreignKey: "document_type_id", as: "companyDocumentsByType" })
// CompanyDocument.belongsTo(DocumentType, { foreignKey: "document_type_id", as: "documentType" })

// // DocumentType ↔ CompanyAuthSignatoryDocument
// DocumentType.hasMany(CompanyAuthSignatoryDocument, { foreignKey: "document_type_id", as: "companyAuthSignaturyDocuments" })
// CompanyAuthSignatoryDocument.belongsTo(DocumentType, { foreignKey: "document_type_id", as: "documentType" })

// // DocumentType ↔ CompanyPartnerDocument
// DocumentType.hasMany(CompanyPartnerDocument, { foreignKey: "document_type_id", as: "companyPartnerDocuments" })
// CompanyPartnerDocument.belongsTo(DocumentType, { foreignKey: "document_type_id", as: "documentType" })

// // DocumentType ↔ CompanyPartnerDocument
// DocumentType.hasMany(DocumentRequirement, { foreignKey: "document_type_id", as: "documentRequirementsByDocType" })
// DocumentRequirement.belongsTo(DocumentType, { foreignKey: "document_type_id", as: "documentType" })



// //// Company ↔ User
// Company.hasMany(User, { foreignKey: "company_id", as: "users" });
// User.belongsTo(Company, { foreignKey: "company_id", as: "company" });

// // Company ↔ CompanyAddress
// Company.hasMany(CompanyAddress, { foreignKey: "company_id", as: "companyAddresses" });
// CompanyAddress.belongsTo(Company, { foreignKey: "company_id", as: "company" });


// // Company ↔ CompanyDocument
// Company.hasMany(CompanyDocument, { foreignKey: "company_id", as: "companyDocuments" })
// CompanyDocument.belongsTo(Company, { foreignKey: "company_id", as: "company" })



// // Company ↔ CompanyDocument
// Company.hasMany(CompanyBankAccount, { foreignKey: "company_id", as: "companyBankAccounts" })
// CompanyBankAccount.belongsTo(Company, { foreignKey: "company_id", as: "company" })



// // Company ↔ CompanyAuthSignatory
// Company.hasMany(CompanyAuthSignatory, { foreignKey: "company_id", as: "companyAuthSignatories" })
// CompanyAuthSignatory.belongsTo(Company, { foreignKey: "company_id", as: "company" })

// // CompanyAuthSignatory ↔ CompanyAuthSignatoryDocument
// CompanyAuthSignatory.hasMany(CompanyAuthSignatoryDocument, { foreignKey: "company_auth_signatory_id", as: "signaturyDocuments" })
// CompanyAuthSignatoryDocument.belongsTo(CompanyAuthSignatory, { foreignKey: "company_auth_signatory_id", as: "companyAuthSignatury" })


// // Company ↔ CompanyPartner
// Company.hasMany(CompanyPartner, { foreignKey: "company_id", as: "companyPartners" })
// CompanyPartner.belongsTo(Company, { foreignKey: "company_id", as: "company" })

// // CompanyPartner ↔ CompanyPartnerDocuments
// CompanyPartner.hasMany(CompanyPartnerDocument, { foreignKey: "company_partner_id", as: "partnerDocuments" })
// CompanyPartnerDocument.belongsTo(CompanyPartner, { foreignKey: "company_partner_id", as: "companyPartner" })


// // Company ↔ CompanyITRReturn
// Company.hasMany(CompanyITRReturn, { foreignKey: "company_id", as: "companyITRReturns" })
// CompanyITRReturn.belongsTo(Company, { foreignKey: "company_id", as: "company" })


// // ItrType ↔ CompanyITRReturn
// ItrType.hasMany(CompanyITRReturn, { foreignKey: "itr_type_id", as: "companyITRReturnsByType" })
// CompanyITRReturn.belongsTo(ItrType, { foreignKey: "itr_type_id", as: "itrType" })








export {
    // AddressType,
    // Role,
    // CompanyType,
    // DocumentType,
    // MsmeType,
    // Company,
    User,
    // CompanyAddress,
    // CompanyAuthSignatory,
    // CompanyAuthSignatoryDocument,
    // CompanyBankAccount,
    // CompanyDocument,
    // CompanyPartner,
    // CompanyPartnerDocument,
    // CompanyITRReturn,
    // ItrType,
    // DocumentRequirement,
    UserLoginDetail
}