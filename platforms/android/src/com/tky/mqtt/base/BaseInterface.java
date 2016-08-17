package com.tky.mqtt.base;


import java.util.List;

/**
 * Created by Administrator on 2016/7/27.
 */
public interface BaseInterface <T> {
    public T loadDataByArg(String arg);

    public List<T> loadAllData();

    /**
     * query list with where clause
     * ex: begin_date_time >= ? AND end_date_time <= ?
     * @param where where clause, include 'where' word
     * @param params query parameters
     * @return
     */

    public List<T> queryData(String where, String... params);

    public List<T> queryByConditions();


    /**
     * insert or update note
     * @param t
     * @return insert or update note id
     */
    public long saveObj(T t);


    /**
     * insert or update noteList use transaction
     * @param list
     */
    public void saveDataLists(final List<T> list);

    /**
     * delete all note
     */
    public void deleteAllData();

    /**
     * delete note by id
     * @param arg
     */
    public void deleteDataByArg(String arg);


    public void deleteObj(T t);
}
