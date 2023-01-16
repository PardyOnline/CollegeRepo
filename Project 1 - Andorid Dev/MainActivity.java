package com.example.sean_pardy_project_1;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity implements RecyclerViewAdapter.ItemClickListener{

    //Declare Recycler View adapter
    RecyclerViewAdapter adapt;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Create array to hold details
        ArrayList<String> amsterdam = new ArrayList<>();

        //Add details to array list - info on all attractions to be listed
        amsterdam.add("Johan Cruyff Arena");
        amsterdam.add("Amsterdam Central Station");
        amsterdam.add("Cecconi's Restaraunt");
        amsterdam.add("Amsterdam Icebar");
        amsterdam.add("Schiphol Airport");

        //Create an array for the images of listed attractions
        ArrayList<Integer> adamImgs = new ArrayList<Integer>();
        adamImgs.add(R.drawable.arena);
        adamImgs.add(R.drawable.central);
        adamImgs.add(R.drawable.cecconis);
        adamImgs.add(R.drawable.icebar);
        adamImgs.add(R.drawable.airport);

        //recycler view
        RecyclerView view = findViewById(R.id.recycler_view);

        //set layout manager
        view.setLayoutManager(new LinearLayoutManager(this));

        //initializing thr recycler view
        adapt = new RecyclerViewAdapter(this, amsterdam, adamImgs);
        adapt.setClickListener(this);
        view.setAdapter(adapt);

    }

    @Override
    public void onItemClick(View view, int position) {
        String attraction = adapt.getItem(position);

        Toast.makeText(this, "you clicked on " +
                attraction + " on position" +
               position, Toast.LENGTH_SHORT).show();
        Intent intent = new Intent(view.getContext(), MainActivity2.class);
        intent.putExtra(" position ", position);
        startActivity(intent);

        }



}