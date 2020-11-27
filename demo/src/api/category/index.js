import Server from '../../utils/request'

// 渲染列表
export function categoryList(data){
    return Server({
        url:`/article/category/search`,
        method:'post',
        ...data
    })
}

// 删除
export function deleteCategory(id){
    return Server({
        url:`/article/category/${id}`,
        method:'delete'
    })
}

// 编辑
export function updateCategory(id){
    return Server({
        url:`/article/category/${id}`,
        method:'get'
    })
}
export function editCategory(data){
    return Server({
        url:`/article/category/`,
        method:'put',
        ...data
    })
}
// 添加
export function addList(data){
    return Server({
        url:`/article/category`,
        method:'post',
        data
    })
}