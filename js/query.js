var Concert = [];
var Drama = [];
var Other = [];
var Childen = [];
var loadc = 0;
var list = [];
var Selectlist = [];
var viewlist = [];
var Likelist = [];
var SelectType = '';
var listMode = 'block';
var listview = [];
var count = [0,0,0,0];
var Join = {
  "stack": {},
  "photo": {}
};
$(LoadAllData);

function Search(str) {
  if (typeof str == 'undefined') {
    str = $('#searchtext').val();
  }
  str = str.toUpperCase();
  viewlist = [];
  for (var i in Selectlist) {
    var o = Selectlist[i];
    if (o.title.toUpperCase().indexOf(str) != -1) {
      viewlist.push(o);
    } else if (o.masterUnit.length > 0 && o.masterUnit[0].toUpperCase().indexOf(str) != -1) {
      viewlist.push(o);
    }
  }
  Show(listMode);
}

function customQuery(arraylist, acount) {
  count = acount;
  Likelist = arraylist;
  UpdateList();
  SortWithLike();
}
function datelimit() {
  var dpd1 = $("#dpd1").val();
  var dpd2 = $("#dpd2").val();
  var dpd1ms = 0;
  var dpd2ms = 0;
  if ( dpd1 != "" ) dpd1ms = new Date( dpd1 ).getTime();
  if ( dpd2 != "" ) dpd2ms = new Date( dpd2 ).getTime();
  if ( dpd1ms == NaN ) dpd1ms = 0;
  if ( dpd2ms == NaN ) dpd2ms = 0;
  console.log(dpd1ms + "~" +dpd2ms);
  viewlist = [];
  for (var i in Selectlist) {
    var o = Selectlist[i];
    var ed = new Date( o.endDate ).getTime();
    var sd = new Date( o.startDate ).getTime();
    if ( ed == NaN ) ed = 0;
    if ( ed == NaN ) ed = 0;
    if (dpd1ms <= ed && ( ed <= dpd2ms || dpd2ms == 0 ) ) {
      viewlist.push(o);
    } else if (dpd1ms <= sd && ( sd <= dpd2ms || dpd2ms == 0 ) ) {
      viewlist.push(o);
    }
  }
  Show(listMode);
  
}
function Select(type) {
  SelectType = type;
  $('.select').removeClass('select-check');
  $('#select' + type).addClass('select-check');
  if (type == '') {
    Selectlist = list;
    Search();
    return;
  }
  Selectlist = [];
  for (var i in list) {
    var o = list[i];
    if (o.type == type) {
      Selectlist.push(o);
    }
  }

  if (type == '') {
    LimitDate();
    return;
  }
  Search();
  if ( type == 'Other' ) 
    $('.inforow').css('background',"#2ECC71");
  if ( type == 'Drama' ) 
    $('.inforow').css('background',"#3498DB");
  if ( type == 'Concert' ) 
    $('.inforow').css('background',"#E67E22");
  if ( type == 'Childen' ) 
    $('.inforow').css('background',"#E74C3C");
}

function SortWithDate() {
  function biggerthen(a, b) {
    if (new Date(a.startDate).getTime() > new Date(b.startDate).getTime())
      return true;
    return false;
  }
  list.sort(biggerthen);
  Select(SelectType);

}

function SortWithLike() {
  function movetofirst(index) {
    var obj = list[index];
    list.splice(index, 1);
    list.splice(0, 0, obj);
  }
  for (var i = Likelist.length - 1; i >= 0; i--) {
    var str = Likelist[i];
    for (var j = 0; j < list.length; j++) {
      var o = list[j];

      if (str == "") {} else if (o.title.toUpperCase().indexOf(str) != -1) {
        movetofirst(j)
      } else if (o.masterUnit.length > 0 && o.masterUnit[0].toUpperCase().indexOf(str) != -1) {
        movetofirst(j)

      } else if (o.showUnit.toUpperCase().indexOf(str) != -1) {
        movetofirst(j)
      }

    }
  }
}

function AddBlock(o) {
  function shortestDiv() {
    var shortest = listview[0];
    for (var i = 1; i < listview.length; i++)
      if (shortest.height() + 50 > listview[i].height())
      // 差50內，還是放在左邊
        shortest = listview[i];
    return shortest;
  }
  PutData( o.blockview, o );
  shortestDiv().append(o.blockview);

}

function JoinActivity(activity, time, j) {
  $.ajax({
    type: "POST",
    url: "update.php",
    data: {
      "user": userID,
      "activity": activity,
      "time": time,
      "isAttend": j
    },
    success: function(a) {
      console.log(a);
      LoadJoin();
    },
    dataType: "text"
  });
}

function Show(mode) {
  if ( typeof mode != 'undefined' )
    listMode = mode;
  $('#listview').empty();
  if (listMode == 'block') {
    listview[0] = $('<div class="listviewChild"></div>');
    listview[1] = $('<div class="listviewChild"></div>');
    listview[2] = $('<div class="listviewChild"></div>');
    $('#listview').append(listview[2]);
    $('#listview').append(listview[1]);
    $('#listview').append(listview[0]);
    for (var i in viewlist) {
      AddBlock(viewlist[i]);
    }
  } else if (listMode == 'row') {
    for (var i in viewlist) {
      PutData( viewlist[i].rowview, viewlist[i] );
      $('#listview').append(viewlist[i].rowview);
    }
  }
}

function LoadAllData() {
  LoadJoin();
  LoadConcert();
  LoadDrama();
  LoadOther();
  LoadChilden();
}

function PutData(newrow, o) {
  if (o.imageUrl != '')
    newrow.find('.img').attr('src', o.imageUrl);
  newrow.find('.name').html(o.title);
  if (o.masterUnit.length > 0)
    newrow.find('.master').html(o.showUnit);
  newrow.find('.disc').html(o.descriptionFilterHtml.replace(/\n/, '<br>'));
  if (o.startDate == o.endDate)
    newrow.find('.date').html(o.startDate);
  else {
    newrow.find('.date').html(o.startDate + '~' + o.endDate);
  }
  newrow.find('.join').html('我要參加');
  newrow.find('.join').attr('onclick', 'JoinActivity("' + o.UID + '","' + o.startDate + '",true)');
  newrow.find('.users').empty();
  if (typeof Join.stack[o.UID] != 'undefined') {
    var users = Join.stack[o.UID];
    for (var i = 0; i < users.length; i++) {
      var uid = users[i];
      if (userID == uid) {
        newrow.find('.join').html('已參加');
        newrow.find('.join').attr('onclick', 'JoinActivity("' + o.UID + '","' + o.startDate + '", false)');
      }
      var photo = Join.photo[uid];
      var newimg = $('<img></img>');
      newimg.attr('src', photo);
      newrow.find('.users').append(newimg);
    }
  }
  newrow.find('.day').html(o.startDate.replace(/[0-9]*\/[0-9]*\//, ''));
  newrow.find('.buylink').attr('href', o.webSales);
}

function UpdateView() {
  for (var i in list) {
    var o = list[i];
    var newblock = $('#infoblock').clone();
    list[i].blockview = newblock;
    var newrow = $('#inforow').clone();
    list[i].rowview = newrow;

  }

}

function UpdateList() {
  function biggerthen(a, b) {
    if (new Date(a.startDate).getTime() > new Date(b.startDate).getTime())
      return true;
    return false;
  }

  list = [];
  Concert.sort(biggerthen);
  Drama.sort(biggerthen);
  Other.sort(biggerthen);
  Childen.sort(biggerthen);
  var c1 = 50;
  var c2 = 50;
  var c3 = 50;
  var c4 = 50;
  if (typeof count != 'undefined') {
    var total = count[0] + count[1] + count[2] + count[3];
    if (total != 0) {
      c1 = 10 / total * count[0] + 3;
      c2 = 10 / total * count[1] + 3;
      c3 = 10 / total * count[2] + 3;
      c4 = 10 / total * count[3] + 3;
    }
  }
  for (var i = 0; i < Concert.length && i < c1; i++) {
    var o = Concert[i];
    o.type = "Concert";
    list.push(o);
  }
  for (var i = 0; i < Drama.length && i < c3; i++) {
    var o = Drama[i];
    o.type = "Drama";
    list.push(o);
  }
  for (var i = 0; i < Other.length && i < c2; i++) {
    var o = Other[i];
    o.type = "Other";
    list.push(o);
  }
  for (var i = 0; i < Childen.length && i < c4; i++) {
    var o = Childen[i];
    o.type = "Childen";
    list.push(o);
  }
  // 建立 element;
  UpdateView();
}
function loadcomplete (){
  loadc += 1;
  console.log ( "load "+ loadc );
  if ( loadc > 11 ) throw arguments.callee.caller.toString();
}
function LoadJoin() {
  $.ajax({
    url: 'query.php',
    type: 'GET',
    dataType: "json",
    success: function(Jdata) {
      Join = Jdata;
      UpdateList();
       Show();
    },
    error: function() {
      setTimeout(LoadJoin, 5000);
    }
  });

}

function LoadConcert() {
  $.ajax({
    url: 'json/concert.json',
    type: 'GET',
    dataType: "json",
    success: function(Jdata) {
      Concert = Concert.concat(Jdata);
      loadcomplete();
    },
    error: function() {
      setTimeout(LoadConcert, 5000);
    }
  });
  $.ajax({
    url: 'json/isomusic.json',
    type: 'GET',
    dataType: "json",
    success: function(Jdata) {
      Concert = Concert.concat(Jdata);
	  console.log(Concert);
      loadcomplete();
    },
    error: function() {
      setTimeout(LoadConcert, 5000);
    }
  });
  $.ajax({
    url: 'json/musicpresent.json',
    type: 'GET',
    dataType: "json",
    success: function(Jdata) {
      Concert = Concert.concat(Jdata);
      loadcomplete();
    },
    error: function() {
      setTimeout(LoadConcert, 5000);
    }
  });
}

function LoadDrama() {
  $.ajax({
    url: 'json/drama.json',
    type: 'GET',
    dataType: "json",
    success: function(Jdata) {
      Drama = Drama.concat(Jdata);
      loadcomplete();
    },
    error: function() {
      setTimeout(LoadDrama, 5000);
    }
  });
  $.ajax({
    url: 'json/dance.json',
    type: 'GET',
    dataType: "json",
    success: function(Jdata) {
      Dance = Drama.concat(Jdata);
      loadcomplete();
    },
    error: function() {
      setTimeout(LoadDrama, 5000);
    }
  });
}

function LoadOther() {
  $.ajax({
    url: 'json/variety.json',
    type: 'GET',
    dataType: "json",
    success: function(Jdata) {
      Other = Other.concat(Jdata);
      loadcomplete();
    },
    error: function() {
      setTimeout(LoadOther, 5000);
    }
  });

}

function LoadChilden() {
  $.ajax({
    url: 'json/children.json',
    type: 'GET',
    dataType: "json",
    success: function(Jdata) {
      Childen = Childen.concat(Jdata);
      loadcomplete();
    },
    error: function() {
      setTimeout(LoadChilden, 5000);
    }
  });
}
