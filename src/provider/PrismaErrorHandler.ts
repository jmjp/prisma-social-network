class PrismaErrorHandler{
    handle(error: string){
        //TODO improve error handling;
        switch(error){
            case 'P2025':
                return "Record not found";
            case 'P2000':
                return "Invalid input";
            case 'P2001':
                return 'No record found for the given condition';
            default:
                return "Unknown error";
        }
    }
}

export { PrismaErrorHandler }