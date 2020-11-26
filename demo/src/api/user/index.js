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