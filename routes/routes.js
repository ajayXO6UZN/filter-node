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
      //  {type:"age",data:['40-100','30-40']},
      //  {type:"class",data:['5-6']},
      //  {type:"name",data:['ajay sahu']},
       // {type:"stocking_age",data:['1']},
    ]

    const newarr = [];
    const stockWhere = [];

    arr.map((item)=>{
        return (
            item.data.map((data)=>{
                return (
                  item.type != 'stocking_age' && (item.type == 'name' ? 
                    newarr.push(JSON.parse(`{"${item.type}":{"$not":{"$in":"${data}"}}}`))
                    :
                    newarr.push(JSON.parse(`{"${item.type}":{"$not":{"$gte":${data.split('-')[0]},"$lte":${data.split('-')[1]}}}}`)))
                )
            })
            
        )
    })

    arr.map((item)=>{
      return (
          item.data.map((data2)=>{
            console.log(data2,"data")
              return (
                item.type == 'stocking_age' && (
                  stockWhere.push(function() { return Math.ceil(
                    (new Date().getTime() -
                      new Date(this.createdAt).getTime()) /
                      (24 * 60 * 60 * 1000)
                  ) == parseInt(data2) })
                  )
              )
          })
          
      )
  })

    //console.log(newarr,"newarr")

    const users = await filterModel.find({
      $where: function() { return Math.ceil(
        (new Date().getTime() -
          new Date(this.createdAt).getTime()) /
          (24 * 60 * 60 * 1000)
      ) >0 },    
      
        $and:newarr?.length >0 && newarr || [{}]
    });


    try {
      response.send({newarr,total:users?.length,users});
    } catch (error) {
      response.status(500).send(error);
    }
  });

  module.exports = app;