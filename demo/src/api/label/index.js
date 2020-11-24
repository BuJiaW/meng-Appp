import Server from '../../utils/request'

// 渲染标签列表
export function labelList(data){
    return Server({
        url:`/article/label/search`,
        method:'post',
        ...data
    })
}

// 删除标签列表
export function deleteList(id){
    return Server({
        url:`article/label/${id}`,
        method:'delete',
    })
}

// 编辑标签列表
export function updateList(id){
    return Server({
        url:`/article/label/${id}`,
        method:'get',
    })
}
export function updateCategory(){
    return Server({
        url:`/article/category/list`,
        method:'get'
    })
}
// 编辑确定标签列表
export function editList(data){
    return Server({
        url:'/article/label',
        method:'put',
        ...data
    })
}

// 添加
export function addList(data){
    return Server({
        url:'/article/label',
        method:'post',
        ...data
    })
}
