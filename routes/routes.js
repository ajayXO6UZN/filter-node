const express = require('express');
const filterModel = require("../modal/filter");
const app = express();

app.post("/add_filter", async (request, response) => {
    const user = new filterModel(request.body);
  
    try {
      await user.save();
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
});

app.get("/filter", async (request, response) => {

    const arr = [
        {type:"age",data:[]},
        {type:"class",data:[]},
        {type:"name",data:[]},
    ]

    const newarr = [];

    arr.map((item)=>{
        return (
            item.data.map((data)=>{
                return (
                    item.type == 'name' ? 
                    newarr.push(JSON.parse(`{"${item.type}":{"$not":{"$in":"${data}"}}}`))
                    :
                    newarr.push(JSON.parse(`{"${item.type}":{"$not":{"$gte":${data.split('-')[0]},"$lte":${data.split('-')[1]}}}}`))
                )
            })
        )
    })

    //console.log(newarr,"newarr")

    const users = await filterModel.find({
        $and:newarr?.length >0 && newarr || [{}]
    });
  
    try {
      response.send({newarr,total:users?.length,users});
    } catch (error) {
      response.status(500).send(error);
    }
  });

  module.exports = app;