####自助系统生成器(generator-component-yywb)


**开发流程**  
1，http://wb.yy.com 组件生成器 填写组件配置信息 生成组件到本地svn目录(http://devserv.game.yy.com/repos/component_wb.yy.com);
  
2，组件英文名称作为组件文件夹名以及全局变量名称。（**_，英文字母，数字组合，不能以数字开头**）;
  
3，svn目录update，进入组件文件夹：  
a，替换组件缩略图thumb文件；  
b，进入src文件夹，修改组件html文件html结构，添加template/模板文件，css/样式文件，js/编写组件处理逻辑，绑定时间；  
c, 进去edit文件夹，js/edit.js编写组件 样式编辑表单 编辑点样式json数据。