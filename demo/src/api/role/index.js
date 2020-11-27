import Server from '../../utils/request'

// 渲染标签列表
export function roleList(data){
    return Server({
        url:`/system/role/search`,
        method:'post',
        data
    })
}

// 删除标签列表
export function deleteList(id){
    return Server({
        url:`/system/role/${id}`,
        method:'delete',
    })
}

// 编辑标签列表
export function updateList(id){
    return Server({
        url:`/system/role/${id}`,
        method:'get',
    })
}
// 编辑确定标签列表
export function editList(data){
    return Server({
        url:'/system/role',
        method:'put',
        data
    })
}

// 添加
export function addList(data){
    return Server({
        url:'/system/role',
        method:'post',
        data
    })
}