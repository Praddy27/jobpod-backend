function initialize_candidate() {
    var candidate = {
        "id": "",
        "first_name": "",
        "last_name": "",
        "email_id": "",
        "phone_no": "",
        "education": "",
        "experience": "",
        "role": "",
        "skill": "",
        "language": "",
        "country": "",
        "rating": "",
        "billing": "",
        "pod_status": "",
        "company_id": "",
        "pod_id": [{}]
    }
    return candidate;
    
}

function initialize_company() {
    var company = {
        "id" : "",
        "company_name": "",
        "email_id": "",
        "phone_no": "",
        "description": "",
        "country": "",
        "pod_id": []
    }
    return company;
    
}

function initialize_pod(){
    var pod = {
        "id" : "",
        "pod_name": "",
        "description": "",
        "skills": "",
        "startDate": "",
        "endDate": "",
        "min_user": "",
        "language": "",
        "user_id": [],
        "email_id": ""
    }
    return pod;
}


module.exports = {
    initialize_candidate, initialize_company, initialize_pod
}