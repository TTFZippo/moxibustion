import Vue from 'vue'
import { Button } from 'element-ui'
import {Form, FormItem} from 'element-ui'
import {Input} from 'element-ui'
// 提示弹窗
import {Message} from 'element-ui'

import {Container, Header, Aside, Main, Menu, Submenu, MenuItemGroup, MenuItem, Table, TableColumn, Switch, Select, Option, Pagination} from 'element-ui'
import { MessageBox, Upload, Loading, Dialog} from 'element-ui';

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem) 
Vue.use(Container) 
Vue.use(Header) 
Vue.use(Aside) 
Vue.use(Main) 
Vue.use(Menu) 
Vue.use(Submenu) 
Vue.use(MenuItemGroup) 
Vue.use(MenuItem) 
Vue.use(Table) 
Vue.use(TableColumn) 
Vue.use(Switch)  
Vue.use(Upload)  
Vue.use(Select)  
Vue.use(Option)  
Vue.use(Pagination)  
Vue.use(Dialog)  
Vue.use(Loading)  
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message