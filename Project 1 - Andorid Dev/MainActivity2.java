package com.example.sean_pardy_project_1;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;

public class MainActivity2 extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        TextView txt = findViewById(R.id.textView2);
        ImageView img = findViewById(R.id.imageView2);


        ArrayList<String> myList = new ArrayList<String>();
        //myList.add("Johan Cruyff Arena");
        //myList.add("Amsterdam Central Station");
        //myList.add("Cecconi's Restaraunt");
        //myList.add("Amsterdam Icebar");
        myList.add("Schiphol Airport");


        ArrayList<Integer> myImages = new ArrayList<Integer>();
        //myImages.add(R.drawable.arena);
        //myImages.add(R.drawable.central);
        //myImages.add(R.drawable.cecconis);
        //myImages.add(R.drawable.icebar);
        myImages.add(R.drawable.airport);


        Bundle extras = getIntent().getExtras();

        if (extras != null) {
            //The key argument here must match that used in the other activity
            Integer id = extras.getInt("position");
            txt.setText(myList.get(id));
            img.setImageResource(myImages.get(id));
        }
    }
}