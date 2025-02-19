[Demo](https://emergency.created.app/)



**This is the project that I am most proud of which we named AI response drone for Search and Rescue. I am from kerala, a southern state in India. In 2018, a flood stuck the state resulted in several deaths and 140 people went missing.**

**It was very difficult for the search and rescue to go in person to the affected areas in search of stranded people from the flood. We were also part of support team by provided food and supplies to the affected areas. We were able to understand the difficulties in reaching to the affected area even after several days from the incident. These incidents motivated us to develop our project.**

to get the
scan the qrcode


![WhatsApp Image 2025-02-18 at 23 19 03_98cadf71](https://github.com/user-attachments/assets/defa1d36-5147-4384-b862-9ecf8fbf3b78)


![WhatsApp Image 2025-02-18 at 23 19 03_6fa38be2](https://github.com/user-attachments/assets/175ea7ff-ee25-4725-b71f-ae02e0d30cbf)


![WhatsApp Image 2025-02-18 at 23 19 03_25f1aad1](https://github.com/user-attachments/assets/18159b67-45f7-4c52-9683-b99b7383a390)


![WhatsApp Image 2025-01-23 at 11 15 39_bee19373](https://github.com/user-attachments/assets/a84bc009-4f6a-4018-854d-8773eb2444a8)


![WhatsApp Image 2025-01-23 at 11 22 35_c7bc182a](https://github.com/user-attachments/assets/7d989bb0-55c8-4e19-9d58-20f637823029)

![IMG-20250123-WA0030](https://github.com/user-attachments/assets/744a3aa4-3327-477f-879f-f87e941e38b3)

![IMG-20250123-WA0031](https://github.com/user-attachments/assets/7cd42306-82b7-4473-86f1-5716573d9d15)

![IMG-20250123-WA0032](https://github.com/user-attachments/assets/3ea895c2-8cd3-46ba-94cd-35be17ea1907)


![IMG-20250123-WA0032](https://github.com/user-attachments/assets/0034532e-867a-4175-8793-b03c3b777de6)

## 1. Introduction

This Arduino sketch provides a flight controller for an X quadcopter based on an Arduino Uno board and the [MPU6050 sensor](https://www.invensense.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf).

Basically, this automation routine is an implementation of a digital PID with a refresh rate of 250Hz.
The method used to calculate PID coefficients is [Ziegler Nichols method](https://en.wikipedia.org/wiki/PID_controller#Ziegler%E2%80%93Nichols_method).
The frame of the quadcopter is based on the [F450](https://www.qwant.com/?q=f450%20frame&t=images).

You can use [this](https://github.com/lobodol/ESC-calibration) to calibrate your ESCs.

A detailed article is available [here](https://www.firediy.fr/article/asservissement-pid-drone-ch-8) (in french).

(i) Currently under active development.

## 2. Requirements
Arduino libraries:
* [Wire](https://www.arduino.cc/en/Reference/Wire)

## 3. Pin connection:
```
       +-------------------------+
       |        MPU-6050         |
       |                         |
       | 3V3  SDA  SCL  GND  INT |
       +--+----+----+----+----+--+
          |    |    |    |
          |    |    |    |
+---------+----+----+----+----------------+
|        3.3V  A4   A5  GND               |
|                                         |
|                                         |
|                 Arduino Uno             |
|                                         |
| #4   #5   #6   #7   #8   #9  #10   #11  |
+--+----+----+----+----+----+----+----+---+
   |    |    |    |    |    |    |    |
  (M1) (M2) (M3) (M4)  |    |    |    |
                       |    |    |    |  
                       |    |    |    |
                    +--+----+----+----+---+
                    | C1   C2   C3   C4   |
                    |                     |
                    |     RF Receiver     |
                    +---------------------+
  
Legend:
Mx: Motor X
Cx: Receiver channel x
```

## 4. Configuration
### 4.1 Remote configuration
By default, this sketch uses the mode 2 for RF remote, according to the following picture:

![remote modes](https://www.firediy.fr/images/articles/drone6/remote_modes.jpg)

The channel mapping is then:

| Channel | Command    |
| :-----: | :--------: |
| 1       | ROLL       |
| 2       | PITCH      |
| 3       | THROTTLE   |
| 4       | YAW        |

To change the channel mapping, update the function `configureChannelMapping` according to your needs:

```c
void configureChannelMapping() {
    mode_mapping[YAW]      = CHANNEL4;
    mode_mapping[PITCH]    = CHANNEL2;
    mode_mapping[ROLL]     = CHANNEL1;
    mode_mapping[THROTTLE] = CHANNEL3;
}
```

### 4.2 PID tuning
The default PID coeffcient values might work for an F450-like quadcopter.
However, you can tune them in the global variable declaration section:

```c
// PID coefficients
float Kp[3] = {4.0, 1.3, 1.3};    // P coefficients in that order : Yaw, Pitch, Roll
float Ki[3] = {0.02, 0.04, 0.04}; // I coefficients in that order : Yaw, Pitch, Roll
float Kd[3] = {0, 18, 18};        // D coefficients in that order : Yaw, Pitch, Roll
````

## 5. Quadcopter orientation

```
 Front
(1) (2)     x
  \ /     z ↑
   X       \|
  / \       +----→ y
(3) (4)
```

* Motor 1: front left  - clockwise
* Motor 2: front right - counter-clockwise
* Motor 3: rear left   - clockwise
* Motor 4: rear left   - counter-clockwise

![Paper plane](https://www.firediy.fr/images/articles/drone-1/ypr.jpg)
* Left wing **up** implies a positive roll
* Nose **up** implies a positive pitch
* Nose **right** implies a positive yaw

The MPU6050 must be oriented as following:

* X axis: roll
* Y axis: pitch
* Z axis: yaw

## 6. Start/stop
This sketch comes with a safety process: to start the quadcopter, move the left stick of the remote in the bottom left corner. Then move it back in center position.

To stop the quadcopter, move the left stick in the bottom right corner.

![State machine](https://www.firediy.fr/images/articles/pid-drone/state_machine.jpg)


## 7. Debug
If you need to print debug messages, make sure to init Serial at **57600 bauds**:

```c
void setup() {
  Serial.begin(57600);
  // ...
}

void loop() {
  Serial.println(measures[ROLL]);
  // ...
}
```



![IMG-20250123-WA0033](https://github.com/user-attachments/assets/2bc39b4c-d662-4fe9-b98a-376f7d1066d8)

![IMG-20250123-WA0034](https://github.com/user-attachments/assets/1e8c986d-2bfa-4ea9-b744-2fbbe38ce393)


![WhatsApp Image 2025-01-23 at 10 30 30_80c29834](https://github.com/user-attachments/assets/de6eac8d-3e90-48cb-b3e4-2100ceff08cc)

![WhatsApp Image 2025-01-23 at 11 06 39_fbb2485d](https://github.com/user-attachments/assets/7b5823d1-d129-491c-aa6c-ae254a21258b)

![WhatsApp Image 2025-01-23 at 11 06 42_ac915f72](https://github.com/user-attachments/assets/bd951c4d-06d0-48bf-b054-bf756bf234ac)

![WhatsApp Image 2025-01-23 at 10 32 25_9bce04db](https://github.com/user-attachments/assets/14a314ed-916d-4b4d-a22d-159f6605132f)

![WhatsApp Image 2025-01-23 at 11 09 57_567f4d61](https://github.com/user-attachments/assets/314217d3-a853-457f-80fc-56d354e41009)

**The Hexacopter drone was provided with AI capabilities of dectecting humans and animals from an aerial view. The model was trained using Heridal dataset which contained images of human and animals stranded from an aerial view. We used Jetson TX2 an edge based computing device with the Pixhawk Flight Controller which enabled the feature of marking coordinates on map and the drone will hover over the enclosed coordinates and send the GPS coordinates along with live video feed when a human is detected. This enabled Search and rescue team to easily arrive at the area of need without wasting there time by searching for the needy people. Our drone had a high payload capacity of 5kg we utilized it for a hot drop mechanism where some immediate survival kit can be dropped to the located area from the drone so that people can survive till the Search and rescue team arrives. We presented our project in an international project presentation and made it to the finals and represented our college.**

![WhatsApp Image 2025-01-23 at 11 10 50_c9636fc5](https://github.com/user-attachments/assets/dc502263-002c-40b0-b73f-e5538797740a)

![WhatsApp Image 2025-01-23 at 11 11 17_d758034c](https://github.com/user-attachments/assets/7bec26ad-887a-4205-8ad7-49bc31798810)


**for easy acess we develop the ANDROID application where people just scan the code and get the requirement items**



![IMG-20250123-WA0008](https://github.com/user-attachments/assets/e9e769fd-95d6-423c-a690-ea51eabe2d65)

![IMG-20250123-WA0009](https://github.com/user-attachments/assets/bd08ebbe-3c79-455b-a849-659cd93b0442)

![IMG-20250123-WA0010](https://github.com/user-attachments/assets/e7bb6fc0-ecd0-43fe-a62f-680f8dc52a53)


![IMG-20250123-WA0011](https://github.com/user-attachments/assets/87ebf250-8246-4f8a-895b-bbbcf6884f86)


**by just scanning the qr code in the application the people can check the required items and see the details when it would be dispatched and delivered to the user.**


![WhatsApp Image 2025-01-23 at 10 48 48_dd123cbe](https://github.com/user-attachments/assets/890d7447-391f-4d6b-943b-843f2bc95c94)


![WhatsApp Image 2025-01-23 at 11 17 18_d6771ebb](https://github.com/user-attachments/assets/a11868c6-06b2-465e-8728-8713ea436ab2)




[Autonomous drone for disaster relief supplies delivery (1).pdf](https://github.com/user-attachments/files/18614703/Autonomous.drone.for.disaster.relief.supplies.delivery.1.pdf)



[Autonomous drone for disaster relief supplies delivery.pptx](https://github.com/user-attachments/files/18614704/Autonomous.drone.for.disaster.relief.supplies.delivery.pptx)



