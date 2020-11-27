import request from '../../utils/request'

//获取列表接口
export function getMenu(){
    return request ({
        url:"/system/menu/search",
        method:"POST"
    })
}

//删除
export function delteMenu(id){
    return request ({
        url:`/system/menu/${id}`,
        method:"POST"
    })
}

//头部新增接口 //右边的新增
export function addMenu(data){
    return request({
        url:"/system/menu",
        method:"POST",
        data  
    })
}


