import axios from "axios";

export const httpGetSpam = async (selectedDate, url, i, key) =>{
    const URL = [
        `https://ru.dez-crm.ru/backend/api/pest/request/kanban-global?search=&phoneNumber=&cardId=&address=&leadStatusesIds[]=3&dateFrom=&dateTo=&createDateFrom=${selectedDate}&createDateTo=${selectedDate}&orderDateFrom=&orderDateTo=&serviceSumFrom=&serviceSumTo=`,
        `https://ru.dez-crm.ru/backend/api/pest/request/kanban-global?loadMore=true&stage=2&offset=${i}&search=&phoneNumber=&cardId=&address=&dateFrom=&dateTo=&createDateFrom=${selectedDate}&createDateTo=${selectedDate}&orderDateFrom=&orderDateTo=&leadStatusesIds[]=3&serviceSumFrom=&serviceSumTo=&leadStatusId=3`
    ]
    const $host = axios.create({
        baseURL: URL[url]
    })
    
    const authInterceptor = config => {
        config.headers.authorization = `Bearer ${key}`
        return config
    }
    
    $host.interceptors.request.use(authInterceptor)
    const {data} = await $host.get()
    return data
}
