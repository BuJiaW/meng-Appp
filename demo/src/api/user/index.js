import Server from '../../utils/request'

//获取用户列表
export function getUserList(current, size) {
    return Server({
        url: "system/user/search",
        method: "POST",
        data: {
            current,
            size
        }
    })
}

//删除
export function deleteUser(id) {
    return Server({
        url: `system/user/${id}`,
        method: "DELETE"

    })
}

//编辑
//1.获取编辑的id
export function editUser(id) {
    return Server({
        url: `/system/user/${id}`,
        method: "GET"
    })
}
//2.确认编辑
export function editUserList() {
    return Server({
        url: "/system/user",
        method: "PUT"
    })
}

//添加
export function UserAdd() {
    return Server({
        url: "/system/user",
        method: "POST"
    })
}

// 修改密码
export function Password(data) {
    return Server({
        url: "/system/user/password",
        method: "PUT",
        ...data
    })
}

// 设置权限
// 列表
export function getList(query,current, size){
    return Server({
        url:'/system/role/search',
        method:'POST',
        data:{
            ...query,
            current, size
        }
    })
}
// 设置角色
export function setUser(id){
    return Server({
        url:`/system/user/${id}/role/save`,
        method:'POST',
    })
}