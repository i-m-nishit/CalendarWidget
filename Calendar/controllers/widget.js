var args = arguments[0] || {};
var config = args.config;
var evtType = 1, index = 0, size = 20, val = 0;
var totalWidth = Ti.Platform.displayCaps.platformWidth;
var density = Ti.Platform.displayCaps.logicalDensityFactor;
if (OS_ANDROID) {
    totalWidth /= density;
}
var perWidth = parseInt(totalWidth / 5);
var comWidth = perWidth * density;
var isAcrossMonth = false;
var isPrev, isNext = false;
var currentController = this;
var halfPerWidth= perWidth/2;
var dateRange = require('dateRange');
var dateRangeInstance = dateRange.dataRangeAccess();
var dateObject = dateRangeInstance.getMonthData();
var remainingDays = parseInt(dateObject.current.monthData.days)-parseInt(dateObject.current.date);
var noDaysToAdd, noOfDays =0;
var currentSection = 1;
var currentSelectedView;
var currentSelectedRow = 0;
var dayArray = dateRangeInstance.getDayArray();
var currentMonthData, isLoaded = false;

function clearData(){
    $.dateScroll.removeAllChildren();
    currentMonthData = null;
    $.eventTable.data = [];
}

function addData(_resultData){
    if(_resultData && _resultData.length > 0)
    {
        updateTableData(_resultData);
        init();
    }else{
        addDataToTable();
    }
}

this.addData = addData;

function scrollListener(e){
    Ti.API.info('e >> '+JSON.stringify(e));
}
    
function updateTableData(tableData){
    currentMonthData = _.groupBy(tableData, 'date');
    var todayDate = dateObject.current.todayDate;
    var dateString = todayDate.getDate();
    addDataToTable(dateString);
}

function addDataToTable(_dateString){
    if(currentMonthData && currentMonthData[_dateString] && currentMonthData[_dateString].length > 0){
        var _tableData = currentMonthData[_dateString];
        var dataArray =[];
        for(var index=0; index < _tableData.length; index++){
            var tableViewRow = $.UI.create('TableViewRow',{title : "  "+_tableData[index].name, height: Ti.UI.SIZE, color :'#111', font:{fontWeight :'bold'}});
            if(density >= 3){
                tableViewRow.applyProperties({font:{fontSize : '20'}});
            }
            dataArray.push(tableViewRow);
        }
        $.eventTable.data = dataArray;  
    }else{
        // Ti.API.info('Absent  Present');
        noData();
    }
    
}

function noData(){
    var tableViewRow = $.UI.create('TableViewRow',{title : 'No Event For today', height: 44});
    $.eventTable.data =[tableViewRow];
}

var style = {
    height : perWidth,
    width : perWidth,
    borderRadius : (perWidth/2),
    left : 1,
};
function onScrollClick(e){
    // Ti.API.info('on click >> '+JSON.stringify(e.source.properties));
    if(currentSelectedView != e.source && e.source.properties){
        currentSelectedView.remove(selectedView);
        e.source.add(selectedView);
        currentSelectedView = e.source;
        addDataToTable(currentSelectedView.properties.date);
    }
}
var dataToBind;
function bindDataTOUpdate(){
        noOfDays = parseInt(dateObject.current.monthData.days);
        dataToBind = {
            days : parseInt(dateObject.prev.monthData.days),
            date : parseInt(dateObject.prev.monthData.days-1),
            day : parseInt(dateRangeInstance.getDayNumber(parseInt(dateObject.prev.endDay.day)-1)),
            month : dateRangeInstance.getMonthDetails(parseInt(dateObject.prev.monthData.month)),
            year : parseInt(dateObject.prev.year),
        };
        isNext = false;
        
}
if(config.type == 'monthly'){
    bindDataTOUpdate();
};
if(config.type == 'weekly'){
    if(dateObject.current.date == 1 || dateObject.current.date == 2){
        isAcrossMonth =true;
        isPrev = true;
        if(dateObject.current.date == 1){
            noDaysToAdd = 2;
        }else{
            noDaysToAdd = 1;
        }
    }
    noOfDays = parseInt(config.weeks) * 7;
    if(remainingDays-noOfDays < 0){
        noDaysToAdd = -(remainingDays-noOfDays);
        isAcrossMonth = true;
        isNext = true;
    }
    dataToBind = {
        days : parseInt(dateObject.current.monthData.days),
        date : parseInt(dateObject.current.date-2),
        day : parseInt(dateRangeInstance.getDayNumber(parseInt(dateObject.current.day)-2)),
        month : dateRangeInstance.getMonthDetails(parseInt(dateObject.current.monthData.month)),
        year : parseInt(dateObject.current.year),
    };
    if(isPrev){
        dataToBind.days = parseInt(dateObject.prev.monthData.days);
        dataToBind.date = parseInt(dateObject.prev.monthData.days - noDaysToAdd);
        dataToBind.day = parseInt(dateRangeInstance.getDayNumber(parseInt(dateObject.prev.endDay.day) - parseInt(noDaysToAdd)));
        dataToBind.month = dateRangeInstance.getMonthDetails(parseInt(dateObject.prev.monthData.month));
        dataToBind.year = parseInt(dateObject.prev.year);
    }else{
        dataToBind.days = parseInt(dateObject.current.monthData.days);
        dataToBind.date = parseInt(dateObject.current.date)-2;
        dataToBind.day = dateRangeInstance.getDayNumber(parseInt(dateObject.current.day.day)-2);
        dataToBind.month = dateRangeInstance.getMonthDetails(parseInt(dateObject.current.monthData.month));
        dataToBind.year = parseInt(dateObject.current.year);
    }
}

var selectedView = $.UI.create('View',{opacity:0.2, backgroundColor : 'green', height:Ti.UI.FILL, width : Ti.UI.FILL});

function addCalendar() {
    // Ti.API.info('dataToBind >> '+JSON.stringify(dataToBind)+" \n "+noOfDays+"");
    var nMonths = 0;
    for (var index = 0; index < (noOfDays+4); index++) {
        var view = $.UI.create('View', style);
        currentController.addClass(view, config.backgroundClass);
        var dayLabel = $.UI.create('Label');
        currentController.addClass(dayLabel,config.dateClass);
        dayLabel.applyProperties({
            text : dataToBind.date,
            height : 30,
            textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER,
            font : {fontSize:25},
            touchEnabled : false
        });
        // Ti.API.info(dateRangeInstance.getDayData(dataToBind.day) + " >> "+dataToBind.day);
        var dayName = $.UI.create('Label');
        currentController.addClass(dayName,config.dateClass);
        dayName.applyProperties({
            text : dayArray[dataToBind.day].shortForm,
            top : 5,
            touchEnabled : false,
            font : {fontSize : 15}
        });
        var monthName = $.UI.create('Label');
        currentController.addClass(monthName,config.dateClass);
        monthName.applyProperties({
            text : dataToBind.month.shortForm,
            bottom : 5,
            font : {fontSize : 15},
            touchEnabled : false
        });
        view.add(dayLabel);
        view.add(dayName);
        view.add(monthName);
        view.properties = {
            date:dataToBind.date, 
            month : dataToBind.month,
            day :  dataToBind.day,
            pos : index
            };
        if(index < 2 || index > (noOfDays+1)){
                var overLay = $.UI.create('View',{width:'100%', height:'100%', backgroundColor:'#777', opacity:'0.8'});
                view.add(overLay);
        }
        // Ti.API.info('dataToBind.month == dateObject.current.monthData.month '+dataToBind.day+" >> "+ dateObject.current.day);
        if(config.type == 'monthly' && dataToBind.date == dateObject.current.date && dataToBind.month.month == dateObject.current.monthData.month && dataToBind.day == dateObject.current.day.day){
            if(currentSelectedView){
                currentSelectedView.remove(selectedView);
            }
            currentSelectedView = view;
            view.add(selectedView);
            if(index > 5){
                if(OS_IOS){
                    val = (perWidth*(index-2))+(index);
                }else{
                    val = (comWidth*(index-2))+(index*density);
                }
            }
            // updateTableData();
        }else if(index == 2){
            if(currentSelectedView){
                currentSelectedView.remove(selectedView);
            }
            currentSelectedView = view;
            view.add(selectedView);
            // updateTableData();
        }
        $.dateScroll.add(view);
        dataToBind.date++;
        dataToBind.day = dateRangeInstance.getDayNumber(dataToBind.day+1);
        
        if(dataToBind.date > dataToBind.days){
            if(isNext){
                dataToBind.days = parseInt(dateObject.next.monthData.days);
                dataToBind.date = parseInt(dateObject.next.date);
                dataToBind.day = parseInt(dateObject.next.startDay.day);
                dataToBind.month = dateRangeInstance.getMonthDetails(parseInt(dateObject.next.monthData.month));
                dataToBind.year = parseInt(dateObject.next.year);
            }else{
                dataToBind.days = parseInt(dateObject.current.monthData.days);
                dataToBind.date = parseInt(dateObject.current.startDate.getDate());
                dataToBind.day = parseInt(dateObject.current.startDay.day);
                dataToBind.month = dateRangeInstance.getMonthDetails(parseInt(dateObject.current.monthData.month));
                dataToBind.year = parseInt(dateObject.current.year);
                nMonths++;
                if(config.type == 'monthly' && nMonths > 0){
                    isNext = true;
                }
            }
        }
    }
};

addCalendar();

function init(){
    var timeout = setTimeout(function(){
        $.dateScroll.scrollTo(val,0);
        clearTimeout(timeout);
    },100);
};

this.init = init;