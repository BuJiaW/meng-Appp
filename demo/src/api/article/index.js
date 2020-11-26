import Server from '../../utils/request'

// 渲染
export function articleList(data){
    return Server({
        url:'/article/article/search',
        method:'post',
        ...data
    })
}

// 删除
export function deleteArticle(id){
    return Server({
        url:`/article/article/${id}`,
        method:'delete'
    })
}

// 查看
export function findArticle(id){
    return Server({
        url:`/article/article/${id}`,
        method:'get'
    })
}
export function findList(){
    return Server({
        url:`/article/category/label/list`,
        method:'get'
    })
}

// 审核
export function auditSuccess(id){
    return Server({
        url:`/article/article/audit/success/${id}`,
        method:'get'
    })
}
// 审核不通过
export function auditFail(id){
    return Server({
        url:`/article/article/audit/fail/${id}`,
        method:'get'
    })
}