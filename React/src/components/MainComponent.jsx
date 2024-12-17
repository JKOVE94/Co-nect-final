const { default: MyToDoList } = require("./TempComp/MyToDOList")
const { default: Projtable } = require("./TempComp/ProjTable")

const MainComponent = () => {

    return(
        <>

        <Projtable/>
        <MyToDoList/>

        </>
    )
}

export default MainComponent