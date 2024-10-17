¡Genial! Voy a desarrollar en más detalle cada uno de los pasos para instalar Gentoo en una máquina virtual, explicando cada concepto para facilitarte el proceso. Ya que tienes conocimientos básicos de Linux, profundizaremos en algunos conceptos y comandos clave que te ayudarán a entender mejor lo que está ocurriendo.

### 1. **Configurar la red (si es necesario)**

Una vez que arranques desde el entorno de instalación (el "live environment" o entorno en vivo), lo primero es asegurarte de que tu máquina tiene acceso a Internet. Esto es vital ya que Gentoo es una distribución basada en la compilación de paquetes y dependes de la red para descargar el código fuente de los programas y herramientas que vas a instalar.

- Verifica tu conexión ejecutando:
  ```bash
  ping -c 4 www.google.com
  ```
  Esto enviará 4 paquetes a Google. Si ves respuestas, significa que tienes conexión.

Si no tienes conexión, puede que necesites configurar la red manualmente. Por ejemplo:

- Para una red cableada (Ethernet), podrías usar `net-setup eth0` para configurar una interfaz de red. La mayoría de los entornos de máquina virtual configuran la red automáticamente, pero si tienes problemas, intenta usar DHCP:
  ```bash
  dhcpcd eth0
  ```

Si estás usando una red Wi-Fi, la configuración puede ser más compleja, pero normalmente Gentoo en entornos virtuales está conectada por Ethernet.

### 2. **Particionar el disco**

Debes crear particiones en el disco de la máquina virtual donde instalarás Gentoo. Las particiones son "áreas" de tu disco que se usan para almacenar diferentes tipos de datos.

#### Usando `fdisk`:

- Abre `fdisk` con el disco virtual:
  ```bash
  fdisk /dev/sda
  ```
  (Asumimos que `/dev/sda` es tu disco. Si no estás seguro, puedes ejecutar `lsblk` o `fdisk -l` para verificar los discos disponibles).

- Una vez dentro de `fdisk`, utiliza las siguientes teclas para crear las particiones:
  - Presiona `n` para crear una nueva partición.
  - Escoge `p` para crear una partición primaria.
  - Define el tamaño y tipo de cada partición.
  
  **Ejemplo básico de particiones:**
  - `/dev/sda1`: Partición de arranque (128 MB).
  - `/dev/sda2`: Partición de swap (el doble del tamaño de tu RAM virtual).
  - `/dev/sda3`: Partición raíz para el sistema operativo (el resto del espacio disponible).

  Puedes hacer que la partición de arranque sea arrancable con `a` y seleccionar la partición 1.

- Cuando hayas terminado de crear las particiones, guarda los cambios escribiendo `w`.

#### Usando `parted` (alternativa):

Si prefieres usar `parted`:
```bash
parted /dev/sda
```
Crea las particiones con los comandos `mkpart` y especifica los tamaños y formatos.

### 3. **Formatear las particiones**

Después de haber particionado el disco, necesitas formatear las particiones para que puedan almacenar datos.

- Formatea la partición de arranque (en este ejemplo `/dev/sda1`) como ext4 (o ext2 si prefieres):
  ```bash
  mkfs.ext4 /dev/sda1
  ```
- Formatea la partición raíz `/dev/sda3` como ext4 (o btrfs/ext4 según prefieras):
  ```bash
  mkfs.ext4 /dev/sda3
  ```
- Prepara la partición de swap y actívala:
  ```bash
  mkswap /dev/sda2
  swapon /dev/sda2
  ```

### 4. **Montar las particiones**

Una vez formateadas las particiones, debes montarlas para comenzar a trabajar en ellas:

- Monta la partición raíz (`/dev/sda3`) en `/mnt/gentoo`:
  ```bash
  mount /dev/sda3 /mnt/gentoo
  ```

- Si tienes una partición de arranque separada (`/dev/sda1`), monta también esta partición en el directorio `/boot` dentro de `/mnt/gentoo`:
  ```bash
  mkdir /mnt/gentoo/boot
  mount /dev/sda1 /mnt/gentoo/boot
  ```

### 5. **Descargar y extraer el Stage 3 de Gentoo**

El **Stage 3** es el sistema base de Gentoo que te proporciona las herramientas esenciales para construir el resto del sistema. Descárgalo y descomprímelo dentro del sistema de archivos montado en `/mnt/gentoo`.

- Cambia al directorio `/mnt/gentoo`:
  ```bash
  cd /mnt/gentoo
  ```

- Descarga el Stage 3 más reciente. Puedes obtener el enlace desde el sitio de Gentoo:
  ```bash
  wget https://bouncer.gentoo.org/fetch/root/all/releases/amd64/autobuilds/current-stage3-amd64/stage3-amd64-<version>.tar.xz
  ```
  (Reemplaza `<version>` con la versión más reciente disponible).

- Extrae el archivo Stage 3 en `/mnt/gentoo`:
  ```bash
  tar xpvf stage3-*.tar.xz --xattrs-include='*.*' --numeric-owner
  ```

### 6. **Configurar el entorno chroot**

Ahora vamos a preparar el entorno `chroot` para comenzar a trabajar desde dentro del sistema Gentoo, en lugar del entorno en vivo.

- Copia el archivo de configuración de DNS de tu entorno en vivo a tu nuevo entorno Gentoo:
  ```bash
  cp -L /etc/resolv.conf /mnt/gentoo/etc/
  ```

- Monta los sistemas de archivos necesarios:
  ```bash
  mount --types proc /proc /mnt/gentoo/proc
  mount --rbind /sys /mnt/gentoo/sys
  mount --make-rslave /mnt/gentoo/sys
  mount --rbind /dev /mnt/gentoo/dev
  mount --make-rslave /mnt/gentoo/dev
  ```

- Entra en el entorno `chroot`:
  ```bash
  chroot /mnt/gentoo /bin/bash
  source /etc/profile
  export PS1="(chroot) $PS1"
  ```

### 7. **Instalar el sistema base**

Ya dentro del entorno `chroot`, comienza la instalación y configuración de tu sistema base.

#### 1. **Configurar el árbol de Portage**
Portage es el sistema de gestión de paquetes de Gentoo. El siguiente paso es sincronizar el árbol de Portage:
```bash
emerge-webrsync
```

#### 2. **Seleccionar el perfil**
Gentoo utiliza "perfiles" para determinar las opciones predeterminadas para tu sistema:
```bash
eselect profile list
```
Selecciona el perfil adecuado para ti (generalmente un perfil `default` o `desktop`):
```bash
eselect profile set <número del perfil>
```

#### 3. **Actualizar el sistema base**
Actualiza los paquetes base para asegurarte de que todo esté al día:
```bash
emerge --ask --verbose --update --deep --newuse @world
```

#### 4. **Configurar el kernel**
Puedes compilar tu propio kernel o usar un kernel genérico:
- Si quieres usar el kernel genérico (recomendado para principiantes):
  ```bash
  emerge sys-kernel/gentoo-sources
  emerge sys-kernel/genkernel
  genkernel all
  ```

#### 5. **Instalar el cargador de arranque (GRUB)**
Instala y configura GRUB para que tu sistema pueda arrancar:
```bash
emerge sys-boot/grub
grub-install /dev/sda
grub-mkconfig -o /boot/grub/grub.cfg
```

#### 6. **Configurar los archivos de configuración básicos**
Configura fstab, hostname, etc. Gentoo tiene una excelente guía en su manual para esto.

### 8. **Finalizar la instalación**
Finalmente, sal del entorno `chroot`, desmonta las particiones, y reinicia:
```bash
exit
umount -l /mnt/gentoo/dev{/shm,/pts,}
umount -R /mnt/gentoo
reboot
```

___

El error que estás viendo indica que el paquete `sys-kernel/linux-firmware`, necesario para `genkernel`, está "enmascarado" debido a problemas de licencia (la licencia `linux-fw-redistributable` está en juego aquí). En Gentoo, los paquetes que están enmascarados debido a licencias requieren un paso adicional para aceptarlos manualmente.

### Pasos para resolver el problema

Aquí te guío a través de los pasos para aceptar la licencia y permitir que el paquete se instale:

### 1. **Aceptar la licencia del paquete**

Debido a que `sys-kernel/linux-firmware` está enmascarado por la licencia, debes permitir que Gentoo utilice paquetes bajo esa licencia.

1. Edita el archivo `/etc/portage/package.license` para permitir el uso de la licencia `linux-fw-redistributable`. Si el archivo no existe, créalo:
   
   ```bash
   nano /etc/portage/package.license
   ```

2. Añade la siguiente línea para aceptar la licencia del paquete `sys-kernel/linux-firmware`:

   ```bash
   sys-kernel/linux-firmware linux-fw-redistributable
   ```

   Guarda y cierra el archivo.

### 2. **Volver a ejecutar el comando de instalación**

Después de aceptar la licencia, puedes intentar instalar `genkernel` de nuevo:

```bash
emerge sys-kernel/genkernel
```

Si todo va bien, la instalación de `genkernel` debería continuar correctamente sin el bloqueo de la licencia.

### 3. **Verificar si el firmware es necesario**

Si no necesitas el paquete `sys-kernel/linux-firmware`, puedes intentar omitirlo, pero `genkernel` generalmente lo requiere para compilar correctamente el kernel con soporte para ciertos controladores. Es recomendable instalarlo a menos que estés seguro de que no lo necesitas.

### 4. **Compilar el kernel una vez resuelto**

Una vez que se resuelva el problema de la licencia y `genkernel` esté instalado, puedes continuar con la compilación del kernel:

```bash
genkernel all
```

___



