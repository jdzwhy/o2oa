package com.x.okr.assemble.common.date;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.x.base.core.logger.Logger;
import com.x.base.core.logger.LoggerFactory;
/**
 * 
 * @项目名 ：OKR
 * @包  名 ：com.x.okr.assemble.common.date
 * @文件名 ：DateOperation.java
 * @作  者 ：李  义
 * @单  位 ：浙江兰德纵横网络技术股份有限公司
 * @日  期 ：2016-06-07
 */
public class DateOperation {
	
	private Logger logger =  LoggerFactory.getLogger( DateOperation.class);
	/**
	 * 根据样式得到格式化对象SimpleDateFormat
	 * @param date
	 * @param style
	 * @return
	 */
	public String getDate(Date date, String style) {
		SimpleDateFormat format = new SimpleDateFormat(style);
		return format.format(date);
	}

	/**
	 * 得到某日期的日期部分
	 * 
	 * @param date
	 * @return yyyy-MM-dd
	 */
	public String getDate(Date date) {
		return format1.format(date);
	}

	/**
	 * 得到某日期的时间部分
	 * 
	 * @param date
	 * @return HH:mm:ss
	 */
	public  String getTime(Date date) {
		return format2.format(date);
	}

	public  Date getDateFromString(String dateString, String style) throws Exception{
		Date date = null;
		if(style==null||"".equals(style.trim())){
			date = format1.parse(dateString);
		}else if( "yyyy-MM-dd HH:mm:ss".equalsIgnoreCase(style.trim())){
			date = format3.parse(dateString);
		}else if( "yyyy-MM-dd HH:mm".equalsIgnoreCase(style.trim())){
			date = format3_2.parse(dateString);
		}else if( "yyyy/MM/dd HH:mm:ss".equalsIgnoreCase(style.trim())){
			date = format3_1.parse(dateString);
		}else if( "yyyy/MM/dd".equalsIgnoreCase(style.trim())){
			date = format4.parse(dateString);
		}else if( "yyyy-MM-dd".equalsIgnoreCase(style.trim())){
			date = format1.parse(dateString);
		}else if( "yyyyMMdd".equalsIgnoreCase(style.trim())){
			date = format5.parse(dateString);
		}else if( "yyyyMMddHHmmss".equalsIgnoreCase(style.trim())){
			date = format7.parse(dateString);
		}else if( "HH:mm:ss".equalsIgnoreCase(style.trim())){
			date = format2.parse(dateString);
		}else if( "HH:mm".equalsIgnoreCase(style.trim())){
			date = format2_1.parse(dateString);
		}else{
			throw new Exception( "对不起，您输入的日期style系统无法识别，请检查您的参数输入！" );
		}
		return date;
	}
	
	/**
	 * 将字符串转换为日期格式
	 * 会尝试多种格式转换，转换成功后返回结果
	 * @param dateString
	 * @return
	 * @throws Exception
	 */
	public  Date getDateFromString( String dateString ) throws Exception{
		Date date = null;
		try{
			date = getDateFromString( dateString, "yyyy-MM-dd HH:mm:ss" );
			return date;
		}catch(Exception e){}

		try{
			date = getDateFromString( dateString, "yyyy-MM-dd HH:mm" );
			return date;
		}catch(Exception e){}
		
		try{
			date = getDateFromString( dateString, "yyyy/MM/dd HH:mm:ss" );
			return date;
		}catch(Exception e){}
		
		try{
			date = getDateFromString( dateString, "yyyy-MM-dd" );
			return date;
		}catch(Exception e){}
		
		try{
			date = getDateFromString( dateString, "yyyy/MM/dd" );
			return date;
		}catch(Exception e){}
		
		try{
			date = getDateFromString( dateString, "yyyyMMdd" );
			return date;
		}catch(Exception e){}
		
		try{
			date = getDateFromString( dateString, "yyyyMMddHHmmss" );
			return date;
		}catch(Exception e){}
		
		try{
			date = getDateFromString( dateString, "HH:mm:ss" );
			return date;
		}catch(Exception e){}
		
		try{
			date = getDateFromString( dateString, "HH:mm" );
			return date;
		}catch(Exception e){}
		
		throw new Exception( "the style of date has error, date:" + dateString );
	}
	
	
	public  String getDateStringFromDate(Date date, String style) throws Exception{
		String dateString = null;
		if(style==null||"".equals(style.trim())){
			dateString = format1.format(date);
		}else if( "yyyy-MM-dd HH:mm:ss".equalsIgnoreCase(style.trim())){
			dateString = format3.format(date);
		}else if( "yyyy/MM/dd HH:mm:ss".equalsIgnoreCase(style.trim())){
			dateString = format3_1.format(date);
		}else if( "yyyy/MM/dd".equalsIgnoreCase(style.trim())){
			dateString = format4.format(date);
		}else if( "yyyy-MM-dd".equalsIgnoreCase(style.trim())){
			dateString = format1.format(date);
		}else if( "yyyyMMdd".equalsIgnoreCase(style.trim())){
			dateString = format5.format(date);
		}else if( "yyyyMMddHHmmss".equalsIgnoreCase(style.trim())){
			dateString = format7.format(date);
		}else if( "HH:mm:ss".equalsIgnoreCase(style.trim())){
			dateString = format2.format(date);
		}else{
			throw new Exception( "对不起，您输入的日期style系统无法识别，请检查您的参数输入！style=" + style);
		}
		return dateString;
	}
	
	/**
	 * 得到某日期加上或减去天数后的日期,day为负数时减去
	 * 
	 * @param date
	 * @param month
	 * @return "yyyy-MM-dd"
	 * @throws Exception 
	 */
	public  String getDayAdd(String dateString, int day, String style) throws Exception {
		Date date = getDateFromString(dateString, style);
		return getDayAdd(date, day);
	}
	
	/**
	 * 得到某日期加上或减去天数后的日期,day为负数时减去
	 * 
	 * @param date
	 * @param month
	 * @return "yyyy-MM-dd"
	 */
	public  String getDayAdd(Date date, int day) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.DATE, day);
		return format1.format(calendar.getTime());
	}

	/**
	 * 得到某日期加上或减去月份后的日期,month为负数时减去
	 * 
	 * @param date
	 * @param month
	 * @return "yyyy-MM-dd"
	 */
	public  String getMonthAdd(Date date, int month) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.MONTH, month);
		return format1.format(calendar.getTime());
	}
	
	/**
	 * 得到某日期加上或减去分钟后的日期,min为负数时减去
	 * 
	 * @param date
	 * @param month
	 * @return "yyyy-MM-dd HH:mi:ss"
	 */
	public  String getMinutesAdd(Date date, int min) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.MINUTE, min);
		return format3.format(calendar.getTime());
	}
	/**
	 * 得到某日期的日
	 * 
	 * @param Date
	 *            date
	 * @return
	 */
	public  String getDay(Date date) {
		try{
			return format10.format(date);
		}catch(Exception e){
			return "0";
		}
	}
	public int getDayNumber(Date date) {
		String result = null;
		try{
			result = format10.format(date);
		}catch(Exception e){
			result = "0";
		}
		return Integer.parseInt(result);
	}
	/**
	 * 得到某日期的月份
	 * 
	 * @param Date
	 *            date
	 * @return
	 */
	public  String getMonth(Date date) {
		try{
			return format9.format(date);
		}catch(Exception e){
			return "0";
		}
	}
	public int getMonthNumber(Date date) {
		String result = null;
		try{
			result = format9.format(date);
		}catch(Exception e){
			result = "0";
		}
		return Integer.parseInt(result);
	}

	/**
	 * 得到某日期的年份
	 * 
	 * @param Date
	 *            date
	 * @return
	 */
	public  String getYear( Date date ) {
		try{
			return format8.format(date);
		}catch(Exception e){
			return "0";
		}
	}
	public int getYearNumber(Date date) {
		String result = null;
		try{
			result = format8.format(date);
		}catch(Exception e){
			result = "0";
		}
		return Integer.parseInt(result);
	}
	/**
	 * 得到某日期的小时
	 * 
	 * @param Date
	 *            date
	 * @return
	 */
	public  String getHour(Date date) {
		try{
			return format11.format(date);
		}catch(Exception e){
			return "0";
		}
	}
	/**
	 * 得到某日期的分钟
	 * 
	 * @param Date
	 *            date
	 * @return
	 */
	public  String getMinites(Date date) {
		return format12.format(date);
	}
	/**
	 * 得到某日期的秒
	 * 
	 * @param Date
	 *            date
	 * @return
	 */
	public  String getSeconds(Date date) {
		return format13.format(date);
	}
	/**
	 * 得到某年有多少天
	 * 
	 * @param String
	 *            date "yyyy-MM-dd"
	 * @return
	 * @throws ParseException
	 */
	@SuppressWarnings("static-access")
	public  int getDaysForYear(String date) throws ParseException {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(format1.parse(date));
		return calendar.get(calendar.DAY_OF_YEAR);
	}

	/**
	 * 得到某年有多少天
	 * 
	 * @param Date
	 *            date
	 * @return
	 * @throws ParseException
	 */
	@SuppressWarnings("static-access")
	public  int getDaysForYear(Date date) throws ParseException {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(calendar.DAY_OF_YEAR);
	}

	/**
	 * 得到某年有多少天
	 * 
	 * @param String
	 *            year "yyyy"
	 * @return
	 * @throws ParseException
	 */
	@SuppressWarnings("static-access")
	public  int getDaysForYear_YYYY(String year) throws ParseException {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(format8.parse(year));
		return calendar.get(calendar.DAY_OF_YEAR);
	}

	/**
	 * 得到某月有多少天
	 * 
	 * @param String
	 *            date "yyyy-MM-dd"
	 * @return
	 * @throws ParseException
	 */
	public  int getDaysForMonth(String date) throws ParseException {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(format1.parse(date));
		return calendar.getActualMaximum( Calendar.DAY_OF_MONTH);
	}

	/**
	 * 得到某月有多少天
	 * 
	 * @param String
	 *            date "yyyy-MM"
	 * @return
	 * @throws ParseException
	 */
	@SuppressWarnings("static-access")
	public  int getDaysForMonth_MM(String date) throws ParseException {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(format14.parse(date));
		return calendar.get(calendar.DAY_OF_MONTH);
	}

	/**
	 * 得到某月有多少天
	 * 
	 * @param Date
	 *            date
	 * @return
	 * @throws ParseException
	 */
	public  int getDaysForMonth(Date date) throws ParseException {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(Calendar.DAY_OF_MONTH);
	}

	/**
	 * 得到当前的日期
	 * 
	 * @return
	 */
	public  String getNowDate() {
		return format1.format(new Date());
	}

	/**
	 * 得到当前的时间
	 * 
	 * @return
	 */
	public  String getNowTime() {
		return format2.format(new Date());
	}
	/**
	 * 得到当前的时间
	 * yyyyMMddHHmmss
	 * @return
	 */
	public  String getNowTimeChar() {
		return format7.format(new Date());
	}
	/**
	 * 得到当前的时间
	 * yyyy-MM-dd HH:mm:ss
	 * @return
	 */
	public  String getNowDateTime() {
		return format3.format(new Date());
	}
	/**
	 * 得到两个时间之前的分差
	 * @param date1 yyyy-MM-dd HH:mm:ss
	 * @param date2 yyyy-MM-dd HH:mm:ss
	 * @return
	 */
	public  long getDeff(String date1,String date2) {
		long dayNumber = 0;
		// 1小时=60分钟=3600秒=3600000
		long mins = 60L * 1000L;
		// long day= 24L * 60L * 60L * 1000L;计算天数之差
		SimpleDateFormat df = null;
		if(date1.length() == 19){
			df = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" );
		}else if(date1.length() == 10){
			df = new SimpleDateFormat( "yyyy-MM-dd" );
		}else if(date1.length() == 8){
			df = new SimpleDateFormat( "HH:mm:ss" );
		}else{
			df = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" );
		}
		try {
			java.util.Date d1 = df.parse(date1);
			java.util.Date d2 = df.parse(date2);
			dayNumber = (d2.getTime() - d1.getTime()) / mins;
		} catch (Exception e) {
			logger.warn( "系统获取得到两个时间之前的分差发生异常" );
			logger.error(e);
		}
		return dayNumber;
	}
	/**
	 * 得到两个时间之前的分差
	 * @param date1 yyyy-MM-dd HH:mm:ss
	 * @param date2 yyyy-MM-dd HH:mm:ss
	 * @return
	 */
	public long getDeff(Date date1,Date date2) {
		long dayNumber = 0;
		// 1小时=60分钟=3600秒=3600000
		long mins = 60L * 1000L;
		// long day= 24L * 60L * 60L * 1000L;计算天数之差
		try {
			dayNumber = (date2.getTime() - date1.getTime()) / mins;
		} catch (Exception e) {
			logger.warn( "系统获取得到两个时间之前的分差发生异常");
			logger.error(e);
		}
		return dayNumber;
	}
	/**
	 * 
	 * 日期格式转换
	 * 从YYYY-MM-DD转换到YYYYMMDD
	 * @param date
	 * @throws ParseException 
	 */
	public  String changeDateFormat(String dateString){
		Date date;
		String reslut = null;
		try {
			if( "".equals(dateString)){
				dateString="0000-00-00";
			}
			date = format1.parse(dateString);
			reslut = format5.format(date);
		} catch (ParseException e) {
			try {
				date = format1.parse( "0000-00-00" );
			} catch (ParseException e1) {
				logger.warn( "系统日期格式转换发生异常");
				logger.error(e);
			}
			logger.warn( "系统日期格式转换发生异常" );
			logger.error(e);
		}
		
		return reslut;
	}
	
	/** 格式 yyyy-MM-dd */
	public  final SimpleDateFormat format1 = new SimpleDateFormat( "yyyy-MM-dd" );
	/** 格式 HH:mm:ss */
	public  final SimpleDateFormat format2 = new SimpleDateFormat( "HH:mm:ss" );
	public  final SimpleDateFormat format2_1 = new SimpleDateFormat( "HH:mm" );
	/** 格式 yyyy-MM-dd HH:mm:ss */
	public  final SimpleDateFormat format3 = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" );
	public  final SimpleDateFormat format3_2 = new SimpleDateFormat( "yyyy-MM-dd HH:mm" );
	public  final SimpleDateFormat format3_1 = new SimpleDateFormat( "yyyy/MM/dd HH:mm:ss" );
	/** 格式 yyyy/MM/dd */
	public  final SimpleDateFormat format4 = new SimpleDateFormat( "yyyy/MM/dd" );
	/** 格式 yyyyMMdd */
	public  final SimpleDateFormat format5 = new SimpleDateFormat( "yyyyMMdd" );
	/** 格式 HHmmss */
	public  final SimpleDateFormat format6 = new SimpleDateFormat( "HHmmss" );
	/** 格式 yyyyMMddHHmmss */
	public  final SimpleDateFormat format7 = new SimpleDateFormat( "yyyyMMddHHmmss" );
	/** 格式 yyyy */
	public  final SimpleDateFormat format8 = new SimpleDateFormat( "yyyy" );
	/** 格式 MM */
	public  final SimpleDateFormat format9 = new SimpleDateFormat( "MM" );
	/** 格式 dd */
	public  final SimpleDateFormat format10 = new SimpleDateFormat( "dd" );
	/** 格式 HH */
	public  final SimpleDateFormat format11 = new SimpleDateFormat( "HH" );
	/** 格式 mm */
	public  final SimpleDateFormat format12 = new SimpleDateFormat( "mm" );
	/** 格式 ss */
	public  final SimpleDateFormat format13 = new SimpleDateFormat( "ss" );
	/** 格式 ss */
	public  final SimpleDateFormat format14 = new SimpleDateFormat( "yyyy-MM" );
	
	
	public  String getStartOfWeek( String dateString ){
		SimpleDateFormat format = new SimpleDateFormat( "yyyy-MM-dd" );
		try {
			Date date = format.parse(dateString);
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			cal.setFirstDayOfWeek(Calendar.MONDAY);
			int tmp = cal.get(Calendar.DAY_OF_WEEK) - 1;
			if (0 == tmp) {
				tmp = 7;
			}
			cal.add(Calendar.DATE, -(tmp-1));
			return getDateStringFromDate(cal.getTime(), "yyyy-MM-dd" ) + " 00:00:00";
		} catch (ParseException e) {
			logger.warn( "系统getStartOfWeek日期格式转换发生异常" );
			logger.error(e);
		} catch (Exception e) {
			logger.warn( "系统getStartOfWeek发生异常" );
			logger.error(e);
		}
		return null;
	}
	
	@SuppressWarnings("unused")
	public  String getEndOfWeek( String dateString ){
		SimpleDateFormat format = new SimpleDateFormat( "yyyy-MM-dd" );
		try {
			Date date = getDateFromString(getStartOfWeek(dateString), "yyyy-MM-dd HH:mm:ss" );
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			cal.setFirstDayOfWeek(Calendar.MONDAY);
			cal.add(Calendar.DATE, 6);
			return getDateStringFromDate(cal.getTime(), "yyyy-MM-dd" ) + " 23:59:59";
		} catch (ParseException e) {
			logger.warn( "系统getEndOfWeek日期格式转换发生异常" );
			logger.error(e);
		} catch (Exception e) {
			logger.warn( "系统getEndOfWeek发生异常",  e);
			logger.error(e);
		}
		return null;
	}
	
	
	
	/**
	 * 将时间格式转换为 **月**日**时**分的格式
	 * @param dateString
	 * @param style
	 * @return
	 * @throws Exception
	 */
	public String getDateCNString( String dateString, String style ) throws Exception{
		StringBuffer ch_date_string = new StringBuffer();
		Date _date = null;
		try{
			_date = getDateFromString( dateString, style );
		}catch(Exception e){
			logger.warn( "系统getDateCNString日期格式转换发生异常" );
			logger.error(e);
		}
		if(_date == null ){
			_date = new Date();
		}
		String year = getYear( _date );
		String month = getMonth( _date );
		String day = getDay( _date );
		String hour = getHour( _date );
		String min = getMinites( _date );
		ch_date_string.append( year );
		ch_date_string.append( "年" );
		ch_date_string.append( month );
		ch_date_string.append( "月" );
		ch_date_string.append( day );
		ch_date_string.append( "日" );
		ch_date_string.append( hour );
		ch_date_string.append( "时" );
		ch_date_string.append( min );
		ch_date_string.append( "分" );		
		return ch_date_string.toString();
	}
	
	/**
	 * 将时间格式转换为 **月**日**时**分**秒 的格式
	 * @param dateString
	 * @param style
	 * @return
	 * @throws Exception
	 */
	public String getDateCNString2( String dateString, String style ) throws Exception{
		StringBuffer ch_date_string = new StringBuffer();
		Date _date = null;
		try{
			_date = getDateFromString( dateString, style );
		}catch(Exception e){
			logger.warn( "系统getDateCNString2日期格式转换发生异常");
			logger.error(e);
		}
		if(_date == null ){
			_date = new Date();
		}
		String year = getYear( _date );
		String month = getMonth( _date );
		String day = getDay( _date );
		String hour = getHour( _date );
		String min = getMinites( _date );
		String sec = getSeconds( _date );
		ch_date_string.append( year );
		ch_date_string.append( "年" );
		ch_date_string.append( month );
		ch_date_string.append( "月" );
		ch_date_string.append( day );
		ch_date_string.append( "日" );
		ch_date_string.append( hour );
		ch_date_string.append( "时" );
		ch_date_string.append( min );
		ch_date_string.append( "分" );
		ch_date_string.append( sec );
		ch_date_string.append( "秒" );
		return ch_date_string.toString();
	}
	
	
	
	
     
	/**
	 * 判断是否周末
	 * @param recordDate
	 * @return
	 */
	public boolean isWeekend(Date date) {
		Calendar cal = Calendar.getInstance();
	    cal.setTime( date );
	    if(cal.get(Calendar.DAY_OF_WEEK)==Calendar.SATURDAY||cal.get(Calendar.DAY_OF_WEEK)==Calendar.SUNDAY){
	       return true;
	    }
		return false;
	}
	
	@SuppressWarnings("unused")
	public long getMinutes( Date date1, Date data2){
		 long l=data2.getTime()-date1.getTime();
		 long day=l/(24*60*60*1000);
		 long hour=(l/(60*60*1000));
		 long min=((l/(60*1000)));
		 return min;
	}

	/**
	 * 根据提供的年份月份，获取当月所有的日期字符串：yyyy-mm-dd
	 * @param s_year
	 * @param _month
	 * @return
	 */
	public List<String> getDateStringFormMonth(String s_year, String _month) {
		List<String> result = new ArrayList<String>();
		Calendar cal = Calendar.getInstance();
		int year = 0;
		int month = 0;
		int days = 0;
		try{
			year = Integer.parseInt( s_year );
		}catch(Exception e){
			e.printStackTrace();
		}
		try{
			month = Integer.parseInt( _month );
		}catch(Exception e){
			e.printStackTrace();
		}
		cal.set(year, month-1, 1);
		days = cal.getActualMaximum(Calendar.DATE);
		for( int i =1; i<= days ; i++){
			result.add( s_year + "-" + (month<10?"0"+month:month) + "-" + (i<10?"0"+i:i));
		}
		return result;
	}
	
	/**
	 * 根据提供的两个时间之间所有的日期字符串：yyyy-mm-dd
	 * @param startDate
	 * @param endDate
	 * @return
	 * @throws Exception 
	 */
	public List<String> listDateStringBetweenDate( Date startDate, Date endDate ) throws Exception {		
		List<String> result = new ArrayList<String>();
		Calendar cal = Calendar.getInstance();
		startDate = getDateFromString( getDateStringFromDate( startDate, "yyyy-MM-dd" ) );
		endDate = getDateFromString( getDateStringFromDate( endDate, "yyyy-MM-dd" ) + " 23:59:59" );	
		cal.setTime( startDate );
		while( cal.getTime().before(endDate)){
			//logger.debug( getDateStringFromDate( cal.getTime(), "yyyy-MM-dd" ) );
			result.add( getDateStringFromDate( cal.getTime(), "yyyy-MM-dd" ));
			cal.add(Calendar.DATE, 1);
		}
		return result;
	}	
	/**
	 * 获取日期所在月份的第一天
	 * @param recordDate
	 * @return
	 * @throws Exception 
	 */
	public Date getFirstDateInMonth(Date recordDate) throws Exception {
		String year = format8.format(recordDate);
		String month = format9.format(recordDate);
		return getDateFromString( year + "-" + month + "-01" );
	}
	
	/**
	 * 获取日期所在月份的第一天
	 * @param recordDate yyyy-MM-dd
	 * @return
	 * @throws Exception 
	 */
	public String getFirstDateStringInMonth(Date recordDate) throws Exception {
		String year = format8.format(recordDate);
		String month = format9.format(recordDate);
		return year + "-" + month + "-01";
	}
	
	/**
	 * 获取当月的最后一日
	 * @param date
	 * @return
	 */
	public static Date getLastDayOfMonth(Date date) {  
        Calendar calendar = convert(date);  
        calendar.set(Calendar.DATE, calendar.getMaximum(Calendar.DATE));  
        return calendar.getTime();  
    }  
	/** 
     * 将日期转换为日历 
     * @param date 日期 
     * @return 日历 
     */  
    private static Calendar convert(Date date) {  
        Calendar calendar = Calendar.getInstance();  
        calendar.setTime(date);  
        return calendar;  
    }  
	/**
	 * 获取日期所在月份的第一天
	 * @param recordDate
	 * @return
	 * @throws Exception 
	 */
	public Date getLastDateInMonth(Date recordDate) throws Exception {
		Date lastDate = getLastDayOfMonth(recordDate);
		return getDateFromString( getDateStringFromDate( lastDate, "yyyy-MM-dd" ) );
	}
	
	/**
	 * 获取日期所在月份的第一天
	 * @param recordDate yyyy-MM-dd
	 * @return
	 * @throws Exception 
	 */
	public String getLastDateStringInMonth(Date recordDate) throws Exception {
		Date lastDate = getLastDayOfMonth(recordDate);
		return getDateStringFromDate( lastDate, "yyyy-MM-dd" );
	}
	
	public static Integer getWeekOfYear(Date date) {  
        Calendar calendar = Calendar.getInstance();  
        calendar.setFirstDayOfWeek(Calendar.MONDAY);  
        calendar.setTime(date);  
        int week = calendar.get(Calendar.WEEK_OF_YEAR);  
        int mouth = calendar.get(Calendar.MONTH);  
        // JDK think 2015-12-31 as 2016 1th week  
        //如果月份是12月，且求出来的周数是第一周，说明该日期实质上是这一年的第53周，也是下一年的第一周  
        if (mouth >= 11 && week <= 1) {  
            week += 52;  
        }  
        return week;  
    }  
  
    public static Integer getYearOfDate(Date date) {  
        Calendar calendar = Calendar.getInstance();  
        calendar.setTime(date);  
        return calendar.get(Calendar.YEAR);  
    }  
  
    public static Integer weeksBetween(Date fromDate, Date toDate) {  
        if (fromDate.before(toDate)) {  
            Date temp = fromDate;  
            fromDate = toDate;  
            toDate = temp;  
        }  
        Integer weekNum = (getWeekOfYear(fromDate) - getWeekOfYear(toDate))  
                + (getYearOfDate(fromDate) - getYearOfDate(toDate)) * 52;  
        return ++weekNum;  
    } 
    
    /**
	 * 获取日期在一年中的周数
	 * 结果从1开始
	 * @param dateString yyyy-mm-dd
	 * @return
	 */
	public  int getWeekNumOfYear( String dateString ){
		try {
			Date date = getDateFromString( dateString , "yyyy-MM-dd" );
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			cal.setFirstDayOfWeek(2);//设置每周的第一天是星期一
			return cal.get( Calendar.WEEK_OF_YEAR );
		} catch (ParseException e) {
			logger.warn( "系统getWeekNumOfYear日期格式转换发生异常" );
			logger.error(e);
		} catch (Exception e) {
			logger.warn( "系统getWeekNumOfYear发生异常" );
			logger.error(e);
		}
		return -1;
	}
	
	/**
	 * 获取日期在一年中的周数
	 * 结果从1开始
	 * @param dateString yyyy-mm-dd
	 * @return
	 */
	public  int getWeekNumOfYear( Date date ){
		try {
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			cal.setFirstDayOfWeek(2);//设置每周的第一天是星期一
			return cal.get( Calendar.WEEK_OF_YEAR );
		} catch (Exception e) {
			logger.warn( "系统getWeekNumOfYear发生异常" );
			logger.error(e);
		}
		return -1;
	}
	
	/**
	 * 计算两个日期之间的周数及详细情况
	 * @param startDateString
	 * @param endDateString
	 * @return
	 */
	public  List<WeekOfYear> getWeeksOfYear( String startDateString, String endDateString ){
		try {
			Date startDate = getDateFromString( startDateString );
			Date endDate = getDateFromString( endDateString );
			return getWeeksOfYear( startDate, endDate );
		} catch (Exception e) {
			logger.warn( "系统getWeekNumOfYear发生异常" );
			logger.error(e);
		}
		return null;
	}
	
	/**
	 * 计算两个日期之间的周数及详细情况
	 * @param startDateString
	 * @param endDateString
	 * @return
	 */
	public  List<MonthOfYear> getMonthsOfYear( String startDateString, String endDateString ){
		try {
			Date startDate = getDateFromString( startDateString );
			Date endDate = getDateFromString( endDateString );
			return getMonthsOfYear( startDate, endDate );
		} catch (Exception e) {
			logger.warn( "系统getMonthsOfYear发生异常" );
			logger.error(e);
		}
		return null;
	}
	
	public List<MonthOfYear> getMonthsOfYear( Date startDate, Date endDate ) {
		List<MonthOfYear> monthOfYearList =  new ArrayList<>();
		MonthOfYear monthOfYear = null;
		String monthStartDateString = null;
		String monthEndDateString = null;
		int year = 0;
		int month = 0;
		try {
			Calendar cal = Calendar.getInstance();
			cal.setTime( startDate );
			
			year = cal.get( Calendar.YEAR );
			month = cal.get( Calendar.MONTH );
			cal.set( year, month, 1 );
			do{	
				cal.set( Calendar.HOUR_OF_DAY, 0 );
				cal.set( Calendar.MINUTE, 0 );
				cal.set( Calendar.SECOND, 0 );
				cal.set( Calendar.MILLISECOND, 0 );
				monthOfYear = new MonthOfYear();
				monthOfYear.setMonth( month + 1 );
				monthOfYear.setYear( year );

				monthStartDateString = getDateStringFromDate( cal.getTime(), "yyyy-MM-dd" );
				monthOfYear.setStartDate( cal.getTime() );
				monthOfYear.setStartDateString( monthStartDateString );
				
				cal.add( Calendar.MONTH, 1 );
				cal.add( Calendar.DAY_OF_MONTH, -1 );
				
				cal.set( Calendar.HOUR_OF_DAY, 23 );
				cal.set( Calendar.MINUTE, 59 );
				cal.set( Calendar.SECOND, 59 );
				cal.set( Calendar.MILLISECOND, 0 );
				monthEndDateString = getDateStringFromDate( cal.getTime(), "yyyy-MM-dd" );
				monthOfYear.setEndDate( cal.getTime() );
				monthOfYear.setEndDateString( monthEndDateString );
				monthOfYearList.add( monthOfYear );
				
				cal.set( year, month, 1 );
				cal.add( Calendar.MONTH, 1 );
				year = cal.get( Calendar.YEAR );
				month = cal.get( Calendar.MONTH );

			}while( cal.getTime().before( endDate ) );
		} catch (Exception e) {
			logger.warn( "系统getMonthsOfYear发生异常" );
			logger.error(e);
		}
		return monthOfYearList;
	}

	/**
	 * 计算两个日期之间的周数及详细情况
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public  List<WeekOfYear> getWeeksOfYear( Date startDate, Date endDate ){
		List<WeekOfYear> weekOfYearList =  new ArrayList<>();
		WeekOfYear weekOfYear = null;
		String weekStartDateString = null;
		String weekEndDateString = null;
		int year = 0;
		int weekNo = 0;
		int day_of_week = 0;
		try {
			Calendar cal = Calendar.getInstance();
			cal.setTime( startDate );
			day_of_week = cal.get( Calendar.DAY_OF_WEEK ) - 1;
			//找出初始周的第一天
			while( day_of_week != 1 ){
				cal.add(Calendar.DATE, -1);
				day_of_week = cal.get( Calendar.DAY_OF_WEEK ) - 1;
			}
			do{
				cal.set( Calendar.HOUR_OF_DAY, 0 );
				cal.set( Calendar.MINUTE, 0 );
				cal.set( Calendar.SECOND, 0 );
				cal.set( Calendar.MILLISECOND, 0 );
				weekOfYear = new WeekOfYear();
				year = cal.get( Calendar.YEAR );
				weekNo = getWeekNumOfYear( cal.getTime() );
				weekOfYear.setWeekNo( weekNo );
				weekOfYear.setYear( year );
				weekStartDateString = getDateStringFromDate( cal.getTime(), "yyyy-MM-dd" );
				weekOfYear.setStartDate( cal.getTime() );
				weekOfYear.setStartDateString( weekStartDateString );
				
				cal.add(Calendar.DATE, 6 );
				weekEndDateString = getDateStringFromDate( cal.getTime(), "yyyy-MM-dd" );
				year = cal.get( Calendar.YEAR );
				if( year > weekOfYear.getYear() ){
					//跨年了,取后一年的
					if( weekOfYear.getWeekNo() == 1 ){
						weekOfYear.setYear( year );
					}
				}
				
				cal.set( Calendar.HOUR_OF_DAY, 23 );
				cal.set( Calendar.MINUTE, 59 );
				cal.set( Calendar.SECOND, 59 );
				cal.set( Calendar.MILLISECOND, 0 );
				weekOfYear.setEndDate( cal.getTime() );
				weekOfYear.setEndDateString( weekEndDateString );
				weekOfYearList.add( weekOfYear );
				cal.add(Calendar.DATE, 1 );
			}while( cal.getTime().before( endDate ) );
		} catch (Exception e) {
			logger.warn( "系统getWeekNumOfYear发生异常" );
			logger.error(e);
		}
		return weekOfYearList;
	}
	
    public static void main(String[] args) throws Exception{
		List<MonthOfYear> list = new DateOperation().getMonthsOfYear( "2016-01-01","2016-12-07" );
		for( MonthOfYear enitty : list ){
			System.out.println( enitty.toString() );
		}
    	
	}
}
