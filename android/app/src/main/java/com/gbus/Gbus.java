package com.gbus;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.View;
import android.widget.RemoteViews;
import android.widget.Toast;

import com.androidnetworking.AndroidNetworking;
import com.androidnetworking.common.Priority;
import com.androidnetworking.error.ANError;
import com.androidnetworking.interfaces.OkHttpResponseAndStringRequestListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;
import okhttp3.Response;

/**
 * Implementation of App Widget functionality.
 */

public class Gbus extends AppWidgetProvider {

    private static final String nextButton    = "nextButton";
    private static final String previousButton    = "previousButton";
    private static final String refreshButton = "refreshButton";

    public static JSONArray arrayIDs = new JSONArray();
    public static int selectedItem = 0;
    public static int timerInterval = 2000;
    public static int appWId;

    public static CountDownTimer timer;

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {

        arrayIDs = new JSONArray();
        appWId = appWidgetId;
        selectedItem = 0;
        try {
            SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
            String appString = sharedPref.getString("appData", "{\"text\":''}");
            JSONObject appData = new JSONObject(appString);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.gbus);

            // 위젯 클릭시 앱 기동
            Intent launchActivity = new Intent(context, MainActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, launchActivity, 0);
            views.setOnClickPendingIntent(R.id.launcher, pendingIntent);
            /////////////////////////////////////////////

            if(appData.getJSONArray("text").length() == 0) {
                views.setViewVisibility(R.id.arrayEmpty, View.VISIBLE);
//                views.setTextViewText(R.id.txtRouteNumEmpty, routeName);
                views.setViewVisibility(R.id.arrayFull, View.GONE);
            } else {
                views.setViewVisibility(R.id.arrayEmpty, View.GONE);
                views.setViewVisibility(R.id.arrayFull, View.VISIBLE);
                for (int i = 0; i < appData.getJSONArray("text").length(); i++ ) {
                    JSONObject item = appData.getJSONArray("text").getJSONObject(i);
                    if (item.getString("type").equals("routeStation")) {
                        String stationId = item.getJSONObject("stationId").getString("_text");
                        for (int j = 0; j < item.getJSONArray("data").length(); j++) {
                            JSONObject route = item.getJSONArray("data").getJSONObject(j);
                            String routeId = route.getJSONObject("routeId").getString("_text");
                            JSONObject routeItem = new JSONObject();
                            routeItem.put("stationName", item.getJSONObject("stationInfo").getJSONObject("stationName").getString("_text"));
                            routeItem.put("stationId", stationId);
                            routeItem.put("routeId", routeId);
                            arrayIDs.put(routeItem);
                        }
                    }
                }

                if(arrayIDs.length() == 1) {
                    views.setViewVisibility(R.id.imgPrevious, View.GONE);
                    views.setViewVisibility(R.id.imgNext, View.GONE);
                } else {
                    views.setViewVisibility(R.id.imgPrevious, View.GONE);
                    views.setViewVisibility(R.id.imgNext, View.VISIBLE);
                }

                timer = new CountDownTimer(10000000000000L, timerInterval)
                {
                    public void onTick(long millisUntilFinished) {
                        try {
                            if(selectedItem == 0) {
                                views.setViewVisibility(R.id.imgPrevious, View.GONE);
                                views.setViewVisibility(R.id.imgNext, View.VISIBLE);
                            } else if(selectedItem == arrayIDs.length() - 1) {
                                views.setViewVisibility(R.id.imgPrevious, View.VISIBLE);
                                views.setViewVisibility(R.id.imgNext, View.GONE);
                            } else {
                                views.setViewVisibility(R.id.imgPrevious, View.VISIBLE);
                                views.setViewVisibility(R.id.imgNext, View.VISIBLE);
                            }
                            restApi(arrayIDs, selectedItem, appWidgetManager, views, appWidgetId);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                    public void onFinish() {}
                };

                timer.start();
            }
            appWidgetManager.updateAppWidget(appWidgetId, views);

        } catch(JSONException e) {
             e.printStackTrace();
        }
    }


    // 정류소아이디와 노선아이디로 해당 정보를 얻어와서 위젯에 뿌려주기위한 API
    ///////////////////////////////////////////////////////////////////////
    public static void restApi(
            JSONArray ids,
            int index,
            AppWidgetManager appWidgetManager,
            RemoteViews views,
            int appWidgetId) throws JSONException {

        if (ids.length() != 0) {
            String stationId =  ids.getJSONObject(index).getString("stationId");
            String routeId = ids.getJSONObject(index).getString("routeId");
            String url = "http://220.64.14.147/ws/rest/busarrivalservice?serviceKey=1234567890&stationId=" + stationId + "&routeId=" + routeId;
            AndroidNetworking.get(url)
                    .setTag("test")
                    .setPriority(Priority.LOW)
                    .build()
                    .getAsOkHttpResponseAndString(new OkHttpResponseAndStringRequestListener() {
                        @Override
                        public void onResponse(Response okHttpResponse, String response) {
                            JSONObject result = null;
                            try {
                                result = XML.toJSONObject(response);
                                Integer status = result.getJSONObject("response").getJSONObject("msgHeader").getInt("resultCode");

                                views.setTextViewText(
                                        R.id.appwidget_text,
                                        arrayIDs.getJSONObject(selectedItem).getString("stationName").length() > 12 ?
                                                arrayIDs.getJSONObject(selectedItem).getString("stationName").substring(0,11) + "..." :
                                                arrayIDs.getJSONObject(selectedItem).getString("stationName")
                                );
                                if(status == 0) {
                                    String routeName = result.getJSONObject("response").getJSONObject("msgBody").getJSONObject("busArrivalItem").getString("routeName");
                                    String routeTypeCd = result.getJSONObject("response").getJSONObject("msgBody").getJSONObject("busArrivalItem").getString("routeTypeCd");
                                    views.setTextViewText(R.id.txtRouteNum, routeName);
                                    views.setTextViewText(R.id.txtRouteNumEmpty, routeName);

                                    views.setTextColor(R.id.txtRouteNum, Color.parseColor(convertColors(routeTypeCd)));
                                    views.setTextColor(R.id.txtRouteNumEmpty, Color.parseColor(convertColors(routeTypeCd)));

                                    if(result.getJSONObject("response").getJSONObject("msgBody").getJSONObject("busArrivalItem").getString("locationNo1").equals("")) {
                                        views.setViewVisibility(R.id.txtEmpty, View.VISIBLE);
                                        views.setViewVisibility(R.id.txtFull, View.GONE);

                                    } else {
                                        views.setViewVisibility(R.id.txtEmpty, View.GONE);
                                        views.setViewVisibility(R.id.txtFull, View.VISIBLE);

                                        String predict = result.getJSONObject("response").getJSONObject("msgBody").getJSONObject("busArrivalItem").getString("predictTime1") + "분";
                                        String lowBusType = result.getJSONObject("response").getJSONObject("msgBody").getJSONObject("busArrivalItem").getString("lowPlate1");
                                        String density = "";
                                        if(result.getJSONObject("response").getJSONObject("msgBody").getJSONObject("busArrivalItem").has("density1")) {
                                            density = result.getJSONObject("response").getJSONObject("msgBody").getJSONObject("busArrivalItem").getString("density1");
                                        }
                                        String remainSeat = result.getJSONObject("response").getJSONObject("msgBody").getJSONObject("busArrivalItem").getString("remainSeatCnt1");

                                        if(!remainSeat.equals("0")) {
                                            if(!remainSeat.equals("-1")) {
                                                views.setViewVisibility(R.id.txtDensity, View.VISIBLE);
                                                views.setTextViewText(R.id.txtDensity, remainSeat);
                                            } else {
                                                views.setViewVisibility(R.id.txtDensity, View.VISIBLE);
                                                views.setTextViewText(R.id.txtDensity, "정보없음");
                                            }
                                        } else {
                                            if (!density.equals("")) {
                                                if (density.equals("1")) {
                                                    views.setViewVisibility(R.id.txtDensity, View.VISIBLE);
                                                    views.setViewVisibility(R.id.txtDensity1, View.GONE);
                                                    views.setViewVisibility(R.id.txtDensity2, View.GONE);
                                                    views.setViewVisibility(R.id.txtDensity3, View.GONE);

                                                    views.setTextViewText(R.id.txtDensity, convertDensityTitle(density));
                                                } else if (density.equals("2")) {
                                                    views.setViewVisibility(R.id.txtDensity, View.GONE);
                                                    views.setViewVisibility(R.id.txtDensity1, View.VISIBLE);
                                                    views.setViewVisibility(R.id.txtDensity2, View.GONE);
                                                    views.setViewVisibility(R.id.txtDensity3, View.GONE);

                                                    views.setTextViewText(R.id.txtDensity1, convertDensityTitle(density));
                                                } else if (density.equals("3")) {
                                                    views.setViewVisibility(R.id.txtDensity, View.GONE);
                                                    views.setViewVisibility(R.id.txtDensity1, View.GONE);
                                                    views.setViewVisibility(R.id.txtDensity2, View.VISIBLE);
                                                    views.setViewVisibility(R.id.txtDensity3, View.GONE);

                                                    views.setTextViewText(R.id.txtDensity2, convertDensityTitle(density));
                                                } else if (density.equals("4")) {
                                                    views.setViewVisibility(R.id.txtDensity, View.GONE);
                                                    views.setViewVisibility(R.id.txtDensity1, View.GONE);
                                                    views.setViewVisibility(R.id.txtDensity2, View.GONE);
                                                    views.setViewVisibility(R.id.txtDensity3, View.VISIBLE);

                                                    views.setTextViewText(R.id.txtDensity3, convertDensityTitle(density));
                                                } else {
                                                    views.setViewVisibility(R.id.txtDensity, View.GONE);
                                                    views.setViewVisibility(R.id.txtDensity1, View.GONE);
                                                    views.setViewVisibility(R.id.txtDensity2, View.GONE);
                                                    views.setViewVisibility(R.id.txtDensity3, View.GONE);
                                                }
                                            }
                                        }
                                        views.setTextViewText(R.id.txtPredict, predict);
                                        views.setTextViewText(R.id.txtBusType, convertLowPlate(lowBusType));
                                    }
                                }
                                appWidgetManager.updateAppWidget(appWidgetId, views);
                            } catch (JSONException e) {
                                Log.e("JSON exception", e.getMessage());
                                e.printStackTrace();
                            }
                        }
                        @Override
                        public void onError(ANError error) {
                            // handle error
                        }
                    });
        }

    }

    private static String convertLowPlate(String str) {
        String lowPlate = "";
        if (str.equals("0")) lowPlate = "일반";
        else if (str.equals("1")) lowPlate = "저상";
        else if (str.equals("2")) lowPlate = "2층";
        else if (str.equals("7")) lowPlate = "트롤리";
        return lowPlate;
    }

    private static String convertDensityTitle(String str) {
        String densityStatus = "";
        if (str.equals("1")) densityStatus = "여유";
        else if (str.equals("2")) densityStatus = "보통";
        else if (str.equals("3")) densityStatus = "혼잡";
        else if (str.equals("4")) densityStatus = "매우혼잡";
        else densityStatus = "정보없음";
        return densityStatus;
    }

    private static String convertColors(String str) {
        String colorType = "";
        if(str.equals("11")|| str.equals("14") || str.equals("16") || str.equals("21")) colorType = "#FD000C";
        else if(str.equals("41") || str.equals("42") || str.equals("43")) colorType = "#D7559F";
        else if(str.equals("51") || str.equals("52") || str.equals("53")) colorType = "#474747";
        else if(str.equals("30")) colorType = "#EFAD32";
        else if(str.equals("12")) colorType = "#038BD4";
        else colorType = "#31BC31";
        return colorType;
    }
    ///////////////////////////////////////////////////////////////////////



    @Override
    public void onReceive(Context context, Intent intent) {
        // TODO Auto-generated method stub
        super.onReceive(context, intent);

        if (nextButton.equals(intent.getAction())) {

            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);

            RemoteViews remoteViews;
            ComponentName watchWidget;

            remoteViews = new RemoteViews(context.getPackageName(), R.layout.gbus);
            watchWidget = new ComponentName(context, Gbus.class);

            try {
                selectedItem ++;
//                    appWidgetManager.updateAppWidget(appWId, remoteViews);
                restApi(arrayIDs, selectedItem, appWidgetManager, remoteViews, appWId);

                remoteViews.setViewVisibility(R.id.imgPrevious, View.VISIBLE);
                if(selectedItem == arrayIDs.length() - 1) {
                    remoteViews.setViewVisibility(R.id.imgNext, View.GONE);
                } else {
                    remoteViews.setViewVisibility(R.id.imgNext, View.VISIBLE);
                }
                appWidgetManager.updateAppWidget(watchWidget, remoteViews);
            } catch (JSONException e) {
                e.printStackTrace();
            }
//            appWidgetManager.updateAppWidget(watchWidget, remoteViews);


        } else if (previousButton.equals(intent.getAction())) {
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);

            RemoteViews remoteViews;
            ComponentName watchWidget;

            remoteViews = new RemoteViews(context.getPackageName(), R.layout.gbus);
            watchWidget = new ComponentName(context, Gbus.class);

            try {
                selectedItem --;
//                    appWidgetManager.updateAppWidget(appWId, remoteViews);
                restApi(arrayIDs, selectedItem, appWidgetManager, remoteViews, appWId);
                remoteViews.setViewVisibility(R.id.imgNext, View.VISIBLE);
                if(selectedItem == 0) {
                    remoteViews.setViewVisibility(R.id.imgPrevious, View.GONE);
                } else {
                    remoteViews.setViewVisibility(R.id.imgPrevious, View.VISIBLE);
                }
                appWidgetManager.updateAppWidget(watchWidget, remoteViews);

            } catch (JSONException e) {
                e.printStackTrace();
            }

        } else {
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);

            RemoteViews remoteViews;
            ComponentName watchWidget;

            remoteViews = new RemoteViews(context.getPackageName(), R.layout.gbus);
            watchWidget = new ComponentName(context, Gbus.class);

            try {
                if(selectedItem == 0) {
                    remoteViews.setViewVisibility(R.id.imgPrevious, View.GONE);
                    remoteViews.setViewVisibility(R.id.imgNext, View.VISIBLE);
                } else if(selectedItem == arrayIDs.length() - 1) {
                    remoteViews.setViewVisibility(R.id.imgPrevious, View.VISIBLE);
                    remoteViews.setViewVisibility(R.id.imgNext, View.GONE);
                } else {
                    remoteViews.setViewVisibility(R.id.imgPrevious, View.VISIBLE);
                    remoteViews.setViewVisibility(R.id.imgNext, View.VISIBLE);
                }
                appWidgetManager.updateAppWidget(watchWidget, remoteViews);

                restApi(arrayIDs, selectedItem, appWidgetManager, remoteViews, appWId);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
//        else {
//            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
//            RemoteViews remoteViews;
//            ComponentName watchWidget;
//            remoteViews = new RemoteViews(context.getPackageName(), R.layout.gbus);
//            watchWidget = new ComponentName(context, Gbus.class);
//            appWidgetManager.updateAppWidget(watchWidget, remoteViews);
//        }
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them

        RemoteViews remoteViews;
        ComponentName watchWidget;
        remoteViews = new RemoteViews(context.getPackageName(), R.layout.gbus);
        watchWidget = new ComponentName(context, Gbus.class);

        remoteViews.setOnClickPendingIntent(R.id.imgNext, getPendingSelfIntent(context, nextButton));
        remoteViews.setOnClickPendingIntent(R.id.imgPrevious, getPendingSelfIntent(context, previousButton));
        remoteViews.setOnClickPendingIntent(R.id.imgRefresh, getPendingSelfIntent(context, refreshButton));

        appWidgetManager.updateAppWidget(watchWidget, remoteViews);

        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    protected PendingIntent getPendingSelfIntent(Context context, String action) {
        Intent intent = new Intent(context, Gbus.class);
        intent.setAction(action);
        return PendingIntent.getBroadcast(context, 0, intent, 0);
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
        timer.cancel();
    }
}

