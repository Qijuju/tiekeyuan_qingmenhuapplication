package com.tky.localContact;



import java.util.Comparator;

/**
 * Created with IntelliJ IDEA.
 * ChildJSBean: tangyan
 * Date: 15-8-18
 */
public class PinyinComparator implements Comparator<Friend> {

    public int compare(Friend o1, Friend o2) {
        if (o1.getSortLetters() != null && o2.getSortLetters() != null) {
            if (o1.getSortLetters().equals("@")
                    || o2.getSortLetters().equals("#")) {
                return -1;
            } else if (o1.getSortLetters().equals("#")
                    || o2.getSortLetters().equals("@")) {
                return 1;
            } else {
                return o1.getSortLetters().compareTo(o2.getSortLetters());
            }
        }else {
            return o1.getSortLetters().compareTo(o2.getSortLetters());
        }


    }


}
