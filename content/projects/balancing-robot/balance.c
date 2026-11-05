// Balance loop, 500 Hz. Complementary filter for tilt, then PID to wheel torque.
#define DT 0.002f
#define ALPHA 0.98f

static float tilt = 0;

float balance_step(float gyro_rate, float accel_angle, Pid *pid) {
  tilt = ALPHA * (tilt + gyro_rate * DT) + (1 - ALPHA) * accel_angle;
  return pid_step(pid, 0.0f, tilt, DT);
}
