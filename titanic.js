d3.csv('train.csv', function(error, data) {
    //先对数据进行处理
    var passager = data.map(function(d){
      if (d.Survived == 0) {
        d.Survived = "死亡"
      }else{
        d.Survived = "幸存"
      }

      if(d.Pclass == 1){
        d.Pclass = "一等座"
      }else if (d.Pclass == 2) {
        d.Pclass = "二等座"
      }else{
        d.Pclass = "三等座"
      }

      return d
    })

    //分别计算男女、一二三等座位死亡与幸存数
    var pclass1_Survived = 0
    var pclass1_Death = 0

    var pclass2_Survived = 0
    var pclass2_Death = 0

    var pclass3_Survived = 0
    var pclass3_Death = 0

    var male_Survived = 0
    var male_Death = 0

    var female_Survived = 0
    var female_Death = 0

    for(var i = 0, l = data.length; i < l; i++) {
      var obj = data[i]

      if (obj.Survived == "幸存" && obj.Pclass == "一等座") {
        pclass1_Survived += 1
      }
      if (obj.Survived == "死亡" && obj.Pclass == "一等座") {
        pclass1_Death += 1
      }
      if (obj.Survived == "幸存" && obj.Pclass == "二等座") {
        pclass2_Survived += 1
      }
      if (obj.Survived == "死亡" && obj.Pclass == "二等座") {
        pclass2_Death += 1
      }
      if (obj.Survived == "幸存" && obj.Pclass == "三等座") {
        pclass3_Survived += 1
      }
      if (obj.Survived == "死亡" && obj.Pclass == "三等座") {
        pclass3_Death += 1
      }
      if (obj.Survived == "幸存" && obj.Sex == "male") {
        male_Survived += 1
      }
      if (obj.Survived == "死亡" && obj.Sex == "male") {
        male_Death += 1
      }
      if (obj.Survived == "幸存" && obj.Sex == "female") {
        female_Survived += 1
      }
      if (obj.Survived == "死亡" && obj.Sex == "female") {
        female_Death += 1
      }
    }

    var width = 1200
    var height = 600

    var nests = d3.nest()
        .key(function(d) { return d.Survived; })
        .rollup(function(peoples) { return peoples.length; })
        .entries(data);

    var nest_sex = d3.nest()
        .key(function(d) { return d.Sex; })
        .rollup(function(sexs) { return sexs.length; })
        .entries(data);

    var nest_pclass = d3.nest()
        .key(function(d) { return d.Pclass; })
        .rollup(function(tickets) { return tickets.length; })
        .entries(data);

    var nest_pclass_survived = d3.nest()
        .key(function(d) { return d.Pclass; })
        .key(function(d) { return d.Survived; })
        .rollup(function(peoples) { return peoples.length; })
        .entries(data);


    // let p = document.createElement("p");
    // p.innerHTML = "泰坦尼克号是一艘奥林匹克级邮轮，于 1912 年 4 月处女航时撞上冰山沉没，泰坦尼克号由位于爱尔兰岛贝尔法斯特的哈兰德与沃尔夫造船厂兴建，是当时最大的客运轮船。1912年4月14日，船上时间夜里11时40分，泰坦尼克号撞上冰山；4月15日凌晨2时20分，船体断裂成两截后沉入大西洋，船上1500多人丧生。泰坦尼克号海难为和平时期死伤人数最惨重的海难之一。  —— —  维基百科 - 泰坦尼克号";
    // document.body.appendChild(p);

    let p = document.createElement("p");
    p.innerHTML = "背景介绍：泰坦尼克号是一艘奥林匹克级邮轮，于 1912 年 4 月处女航时撞上冰山沉没，泰坦尼克号由位于爱尔兰岛贝尔法斯特的哈兰德与沃尔夫造船厂兴建，是当时最大的客运轮船。1912年4月14日，船上时间夜里11时40分，泰坦尼克号撞上冰山；4月15日凌晨2时20分，船体断裂成两截后沉入大西洋，船上1500多人丧生。泰坦尼克号海难为和平时期死伤人数最惨重的海难之一。 下面这个可视化使用柱状图展示了泰坦尼克号中幸存者和遇难者的人数统计。";
    document.body.appendChild(p);

    //生存死亡柱状图
    var svg = dimple.newSvg("body", width, height);
    var chart = new dimple.chart(svg, nests);
    var x = chart.addCategoryAxis("x", "key");
    var y = chart.addMeasureAxis("y", "value");
    var s = chart.addSeries(null, dimple.plot.bar);
    x.title = "状态"
    y.title = "人数"

    s.afterDraw = function(shape, data){
      var sp = d3.select(shape);
      var rect = {
                  x: parseFloat(sp.attr("x")),
                  y: parseFloat(sp.attr("y")),
                  width: parseFloat(sp.attr("width")),
                  height: parseFloat(sp.attr("height"))
                };

                if (rect.height >= 8) {
                    // Add a text label for the value
                    svg.append("text")
                      // Position in the centre of the shape (vertical position is
                      // manually set due to cross-browser problems with baseline)
                      .attr("x", rect.x + rect.width / 2)
                      .attr("y", rect.y + rect.height / 2 + 3.5)
                      // Centre align
                      .style("text-anchor", "middle")
                      .style("font-size", "10px")
                      .style("font-family", "sans-serif")
                      // Make it a little transparent to tone down the black
                      .style("opacity", 0.6)
                      // Prevent text cursor on hover and allow tooltips
                      .style("pointer-events", "none")
                      // Format the number
                      .text(data.yValue);
                  }
    }

    chart.draw();

    svg.append("text")
    .attr("x", (width/2))
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("泰坦尼克号乘客生存和死亡情况");

    //生存死亡比例饼图
    var svg_pie = dimple.newSvg("body", width, height);
    svg_pie.append("text")
    .attr("x", (width/2))
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("泰坦尼克号乘客生存和死亡比例");

    var chart_pie = new dimple.chart(svg_pie, nests);
    chart_pie.setBounds(width/2 - 180, height/2 - 180, 360, 360)
    chart_pie.addMeasureAxis("p", "value");
    var pie1 = chart_pie.addSeries("key", dimple.plot.pie);
    chart_pie.assignColor("死亡", "#FA9A91");
    chart_pie.assignColor("幸存", "#9BC1DA");
    chart_pie.addLegend(480, 100, 90, 300, "left");
    chart_pie.draw();

    //海难发生前乘客的座位等级数柱状图
    var svg_ticket = dimple.newSvg("body", width, height);
    svg_ticket.append("text")
    .attr("x", (width/2))
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("泰坦尼克号乘客的座位等级情况");

    var chart_ticket = new dimple.chart(svg_ticket, nest_pclass);
    var x_ticket = chart_ticket.addCategoryAxis("x", "key");
    var y_ticket = chart_ticket.addMeasureAxis("y", "value");
    var s_ticket = chart_ticket.addSeries(null, dimple.plot.bar);
    x_ticket.title = "座位等级"
    y_ticket.title = "人数"

    s_ticket.afterDraw = function(shape, data){
      var sp = d3.select(shape);
      var rect = {
                  x: parseFloat(sp.attr("x")),
                  y: parseFloat(sp.attr("y")),
                  width: parseFloat(sp.attr("width")),
                  height: parseFloat(sp.attr("height"))
                };

                if (rect.height >= 8) {
                    // Add a text label for the value
                    svg_ticket.append("text")
                      // Position in the centre of the shape (vertical position is
                      // manually set due to cross-browser problems with baseline)
                      .attr("x", rect.x + rect.width / 2)
                      .attr("y", rect.y + rect.height / 2 + 3.5)
                      // Centre align
                      .style("text-anchor", "middle")
                      .style("font-size", "10px")
                      .style("font-family", "sans-serif")
                      // Make it a little transparent to tone down the black
                      .style("opacity", 0.6)
                      // Prevent text cursor on hover and allow tooltips
                      .style("pointer-events", "none")
                      // Format the number
                      .text(data.yValue);
                  }
    }

    chart_ticket.draw();

    //拥有一等座的乘客的幸存比例
    var pclass_1 = [
      {"key": "幸存", "value": pclass1_Survived},
      {"key": "死亡", "value": pclass1_Death}
    ]

    var svg_pie_pclass = dimple.newSvg("body", width, height);
    svg_pie_pclass.append("text")
    .attr("x", 400)
    .attr("y", height/2 - 150)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("一等座乘客生存和死亡比例");

    var pie_pclass_1 = new dimple.chart(svg_pie_pclass, pclass_1);
    pie_pclass_1.setBounds(350, height/2 - 75, 150, 150)
    pie_pclass_1.addMeasureAxis("p", "value");
    var pie_pclass_s1 = pie_pclass_1.addSeries("key", dimple.plot.pie);
    pie_pclass_1.assignColor("死亡", "#FA9A91");
    pie_pclass_1.assignColor("幸存", "#9BC1DA");
    pie_pclass_1.addLegend(480, 180, 90, 300, "left");
    pie_pclass_1.draw();

    //拥有二等座的乘客的幸存比例
    var pclass_2 = [
      {"key": "幸存", "value": pclass2_Survived},
      {"key": "死亡", "value": pclass2_Death}
    ]

    svg_pie_pclass.append("text")
    .attr("x", 600)
    .attr("y", height/2 - 150)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("二等座乘客生存和死亡比例");

    var pie_pclass_2 = new dimple.chart(svg_pie_pclass, pclass_2);
    pie_pclass_2.setBounds(550, height/2 - 75, 150, 150)
    pie_pclass_2.addMeasureAxis("p", "value");
    pie_pclass_2.addSeries("key", dimple.plot.pie);
    pie_pclass_2.assignColor("死亡", "#FA9A91");
    pie_pclass_2.assignColor("幸存", "#9BC1DA");
    pie_pclass_2.addLegend(680, 180, 90, 300, "left");
    pie_pclass_2.draw();

    //拥有三等座的乘客的幸存比例
    var pclass_3 = [
      {"key": "幸存", "value": pclass3_Survived},
      {"key": "死亡", "value": pclass3_Death}
    ]

    svg_pie_pclass.append("text")
    .attr("x", 800)
    .attr("y", height/2 - 150)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("三等座乘客生存和死亡比例");

    var pie_pclass_3 = new dimple.chart(svg_pie_pclass, pclass_3);
    pie_pclass_3.setBounds(750, height/2 - 75, 150, 150)
    pie_pclass_3.addMeasureAxis("p", "value");
    pie_pclass_3.addSeries("key", dimple.plot.pie);
    pie_pclass_3.assignColor("死亡", "#FA9A91");
    pie_pclass_3.assignColor("幸存", "#9BC1DA");
    pie_pclass_3.addLegend(880, 180, 90, 300, "left");
    pie_pclass_3.draw();

    //海难发生前乘客的男女性别数柱状图
    var svg_sex = dimple.newSvg("body", width, height);
    svg_sex.append("text")
    .attr("x", (width/2))
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("泰坦尼克号乘客的男女性别情况");

    var chart_sex = new dimple.chart(svg_sex, nest_sex);
    var x_sex = chart_sex.addCategoryAxis("x", "key");
    var y_sex = chart_sex.addMeasureAxis("y", "value");
    var s_sex = chart_sex.addSeries(null, dimple.plot.bar);
    x_sex.title = "性别"
    y_sex.title = "人数"

    s_sex.afterDraw = function(shape, data){
      var sp = d3.select(shape);
      var rect = {
                  x: parseFloat(sp.attr("x")),
                  y: parseFloat(sp.attr("y")),
                  width: parseFloat(sp.attr("width")),
                  height: parseFloat(sp.attr("height"))
                };

                if (rect.height >= 8) {
                    // Add a text label for the value
                    svg_sex.append("text")
                      // Position in the centre of the shape (vertical position is
                      // manually set due to cross-browser problems with baseline)
                      .attr("x", rect.x + rect.width / 2)
                      .attr("y", rect.y + rect.height / 2 + 3.5)
                      // Centre align
                      .style("text-anchor", "middle")
                      .style("font-size", "10px")
                      .style("font-family", "sans-serif")
                      // Make it a little transparent to tone down the black
                      .style("opacity", 0.6)
                      // Prevent text cursor on hover and allow tooltips
                      .style("pointer-events", "none")
                      // Format the number
                      .text(data.yValue);
                  }
    }

    chart_sex.draw();

    //男性乘客的幸存比例
    var data_male = [
      {"key": "幸存", "value": male_Survived},
      {"key": "死亡", "value": male_Death}
    ]

    var svg_pie_sex = dimple.newSvg("body", width, height);
    svg_pie_sex.append("text")
    .attr("x", 500)
    .attr("y", 50)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("男性乘客的幸存死亡比例");

    var pie_male = new dimple.chart(svg_pie_sex, data_male);
    pie_male.setBounds(380, height/2 - 150, 250, 250)
    pie_male.addMeasureAxis("p", "value");
    pie_male.addSeries("key", dimple.plot.pie);
    pie_male.assignColor("死亡", "#FA9A91");
    pie_male.assignColor("幸存", "#9BC1DA");
    pie_male.addLegend(580, 120, 90, 300, "left");
    pie_male.draw();

    //女性乘客的幸存比例
    var data_female = [
      {"key": "幸存", "value": female_Survived},
      {"key": "死亡", "value": female_Death}
    ]

    svg_pie_sex.append("text")
    .attr("x", 800)
    .attr("y", 50)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("女性乘客的幸存死亡比例");

    var pie_female = new dimple.chart(svg_pie_sex, data_female);
    pie_female.setBounds(700, height/2 - 150, 250, 250)
    pie_female.addMeasureAxis("p", "value");
    var pie = pie_female.addSeries("key", dimple.plot.pie);
    pie_female.assignColor("死亡", "#FA9A91");
    pie_female.assignColor("幸存", "#9BC1DA");
    pie_female.addLegend(900, 120, 90, 300, "left");
    pie_female.draw();
  });
